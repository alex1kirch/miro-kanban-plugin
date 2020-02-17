import axios from 'axios'
import uuid from 'uuid'
import {getBoardDataUrl, getSwimlinesData, getBoardDescrUrl, getTransitionsUrl} from 'jira'
import {APP_ID} from 'config'
import {createCard} from 'card'

export async function createFromUrl(url: string) {
  const uri = new URL(url)
  const boardId = uri.searchParams.get("rapidView")
  
  const response = await Promise.all([
    axios.get('/jira/rest', {
      params: {
        query: getBoardDataUrl(boardId)
      } 
    }),
    axios.get('/jira/rest', {
      params: {
        query: getBoardDescrUrl(boardId)
      } 
    })
  ])
  
  const colors = ["#000000", "#2a79ff", "#7cc576"]

  const jiraData = response[0].data
  const statusIdTotransitionIdMap = {}
  
  if (jiraData.issuesData.issues.length) {
    // HACK: we have to do it on the server
    const transitionsData = await axios.get('/jira/rest', {
      params: {
        query: getTransitionsUrl(jiraData.issuesData.issues[0].id)
      } 
    })

    transitionsData.data.transitions.forEach(tr => {
      statusIdTotransitionIdMap[tr.to.id] = tr.id
    })
  }
  
  response[1].data.issues.forEach(i => {
    const si = jiraData.issuesData.issues.find(ii => String(ii.id) == i.id)
    if (si) {
      si.description = i.fields.description
    }
  })
  const statusIdToKanbanColumnIdMap = {}
  const transitionIdToKanbanColumnIdMap = {}
  const kanbanColumns = []
  
  jiraData.columnsData.columns.forEach((c, i) => {
    const column = { 
      "id": uuid(),
      "subColumnId": uuid(),
      "title": c.name,
      "color": colors[i % colors.length]
    }
    
    kanbanColumns.push(column)
    c.statusIds.forEach(statusId => {
      statusIdToKanbanColumnIdMap[statusId] = {
        columnId: column.id,
        subColumnId: column.subColumnId
      }
      
      transitionIdToKanbanColumnIdMap[statusId] = {
        columnId: column.id,
        subColumnId: column.subColumnId,
        transitionId: statusIdTotransitionIdMap[statusId]
      }
    })
  })
  
  const { swimlines, getSwimlineIdByIssue } = getSwimlinesData(jiraData)
  const items = await miro.board.widgets.create(jiraData.issuesData.issues
                                                .filter(i => !!getSwimlineIdByIssue(i) && !i.__hidden && !i.hidden)
                                                .map(createCard))
  
  const widgetJiraMap = items.reduce((p, w) => {
    p[w.id] = jiraData.issuesData.issues.find(i => i.id === w.metadata[APP_ID].jiraIssueId)
    return p
  }, {})
  
  const kanban = {
    "type": "KANBAN",
    "title": jiraData.boardName,
    "columns": kanbanColumns,
    "swimlanes": swimlines,
    "clientVisible": false,
    "metadata": {
      [APP_ID]: {
        statusIdToKanbanColumnIdMap: transitionIdToKanbanColumnIdMap
      }
    },
    "items": items.map(w => (
      {
        "swimlaneId": getSwimlineIdByIssue(widgetJiraMap[w.id]),
        ...statusIdToKanbanColumnIdMap[w.metadata[APP_ID].issueStatusId],
        "widgetId": w.id
      }))
  }
  
  const createdKanban = (await miro.board.widgets.create(kanban))[0]
  console.log(kanban)
  
  await miro.board.widgets.update([
    {
      id: createdKanban.id,
      "clientVisible": true,
    },
    ...items.map(w => ({ id: w.id, "clientVisible": true, }))                        
  ])
     
  const boardInfo = await miro.board.info.get()
  
  axios.post('https://45647fgdh.ngrok.io/api/v1/start', {
    "boardId": boardInfo.id,
    "boardInfo": boardInfo,
    "type": "KANBAN",
    "title": jiraData.boardName,
    "columns": kanbanColumns,
    "swimlanes": swimlines,
    "metadata": {
      [APP_ID]: {
        statusIdToKanbanColumnIdMap: transitionIdToKanbanColumnIdMap
      }
    },
    "items": items.map(w => (
      {
        "swimlaneId": getSwimlineIdByIssue(widgetJiraMap[w.id]),
        ...statusIdToKanbanColumnIdMap[w.metadata[APP_ID].issueStatusId],
        "widgetId": w.id,
        ...w.metadata[APP_ID]
      }))
  })
}

