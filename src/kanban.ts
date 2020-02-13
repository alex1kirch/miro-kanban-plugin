import axios from 'axios'
import uuid from 'uuid'

export async function createFromUrl(url: string) {
  const uri = new URL(url)
  const boardId = uri.searchParams.get("rapidView")
  
  const response = await axios.get('/jira/rest', {
    params: {
      query: `/rest/agile/1.0/board/${boardId}/configuration`
    } 
  })

  const colors = ["#000000", "#2a79ff", "#7cc576"]
  
  console.log(response);
  const columns = response.data.columnConfig.columns.map((c, i) => ({ 
    "id": uuid(),
    "title": c.name,
    "color": colors[i % colors.length]
  }))
  
  const swimlines = response.data.columnConfig.columns.map((c, i) => ({ 
    "id": uuid(),
    "title": c.name,
    "color": colors[i % colors.length]
  }))
  
  await miro.board.widgets.create({
    "type": "KANBAN",
    "title": "Sprint 01 " + response.data.name,
    "columns": columns,
    "swimlanes": [
      {
        "id": uuid(),
        "title": "Untitled"
      }
    ],
    // "items": [
    //   {
    //     "swimlaneId": "bceeb731-4ac5-4c09-b054-25b3f74e5ee0",
    //     "columnId": "6b04bcfd-2fe2-4f67-9520-361f7e7a097c",
    //     "widgetId": "3074457345621837639"
    //   }
    // ]
  })
}