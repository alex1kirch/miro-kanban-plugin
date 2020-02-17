import {PROJECT_KEY, JIRA_HOST, JIRA_BOARD_PATH} from 'config'
import uuid from 'uuid'

export function getBoardDataUrl(rapidViewId: string) {
  return `/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=${rapidViewId}&selectedProjectKey=${PROJECT_KEY}`
}

export function getBoardDescrUrl(rapidViewId: string) {
  return `/rest/agile/latest/board/${rapidViewId}/issue?maxResults=1000&fields=description`
}

export function getTransitionsUrl(issueId: string) {
  return `/rest/api/2/issue/${issueId}/transitions`
}

export function checkJiraBoardUrl(url: string) {
  const uri = new URL(url)
  const rapidViewId = uri.searchParams.get('rapidView')
  
  return !!rapidViewId && url.startsWith(JIRA_HOST + JIRA_BOARD_PATH)
}

export function getSwimlinesData(jiraData) {
  const swimlines = []
  let getSwimlineIdByIssue = (i) => null
  
  switch (jiraData.swimlanesData.swimlaneStrategy) {
    case 'assignee':
      const assignees = {}
            
      jiraData.issuesData.issues.forEach(v => {
        const assigneeName = v.assigneeName || 'Unassigned'
        assignees[assigneeName] = swimline.id
      })
      
      const uniqAssignees = Object.keys(assignees)
      uniqAssignees.sort()
      uniqAssignees.forEach(assignee => {
        const swimline = {
          "id": uuid(),
          "title": assignee
        }
        swimlines.push(swimline)
        assignees[assignee] = swimline.id
      })
      
      getSwimlineIdByIssue = (i) => assignees[i.assigneeName || 'Unassigned'] || null
      break
    case 'custom':
      const issueIdToSwimlineId = {}
      
      jiraData.swimlanesData.customSwimlanesData.swimlanes.forEach(swimlane => {
        const swimline = {
          "id": uuid(),
          "title": swimlane.description != '' ? `${swimlane.name} | ${swimlane.description}` : swimlane.name
        }
        
        swimlane.issueIds.forEach(issueId => {
          issueIdToSwimlineId[issueId] = swimline.id
        })
        swimlines.push(swimline)
      })
      
      getSwimlineIdByIssue = (i) => issueIdToSwimlineId[i.id] || null
      break
    case 'parentChild': 
      const parentIssueIdToKanbanSwimlineIdMap = {}

      jiraData.swimlanesData.parentSwimlanesData.parentIssueIds.forEach(issueId => {
        const issue = jiraData.issuesData.issues.find(i => i.id === issueId)
        issue.__hidden = true
        const swimline = {
          "id": uuid(),
          "title": `${issue.key}: ${issue.summary}`
        }
        swimlines.push(swimline)
        parentIssueIdToKanbanSwimlineIdMap[issue.id] = swimline.id
      })
            
      const otherIssuesSwimlines = jiraData.issuesData.issues.filter(i => !parentIssueIdToKanbanSwimlineIdMap[i.parentId] && !i.__hidden)
      if (otherIssuesSwimlines.length) {
        const swimline = {
          "id": uuid(),
          "title": `Other issues`
        }
        swimlines.push(swimline)
        parentIssueIdToKanbanSwimlineIdMap["default"] = swimline.id
      }
      
      getSwimlineIdByIssue = (i) => parentIssueIdToKanbanSwimlineIdMap[i.parentId || 'default'] || null
      break
    case 'none':
    default:
      const swimline = {
        "id": uuid(),
        "title": assignee
      }
      swimlines.push(swimline)
      
      getSwimlineIdByIssue = (i) => swimline.id
      break
  }
  
  return { swimlines, getSwimlineIdByIssue }
}