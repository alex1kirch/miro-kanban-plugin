import {APP_ID} from 'config'

const host = 'https://miro-kanban-plugin.glitch.me/jira/image?url='
// const host = 'https://karabanov.ngrok.io/jira/image?url='

export function createCard(issue) {
  const card = {
    "type": "CARD",
    "style": {
      "backgroundColor": issue.color
    },
    "metadata": {
      [APP_ID]: {
        issueId: issue.id,
        parentId: issue.parentId,
        issueStatusId: issue.statusId,
        // for pollong
        jiraIssueId: issue.id,
        description: issue.description,
        summary: issue.summary,
      }
    },
    "clientVisible": false,
    "title": issue.summary,
    "description": issue.description,
    // "tags": [
    //   {
    //     "id": "3074457347235004303",
    //     "title": "Tag",
    //     "color": "#da0063",
    //     "widgetIds": [
    //       "3074457347233991284",
    //       "3074457347240012071"
    //     ]
    //   }
    // ],
    "card": {
      "customFields": [
        {
          "value": issue.statusName,
          ...getImageUrlObject(issue.statusUrl),
          "tooltip": "Status",
          "fieldType": "string",
          "fontColor": "#ffffff",
          "mainColor": "#14892c"
        },
        {
          "value": issue.key,
          ...getImageUrlObject(issue.typeUrl),
          "tooltip": "Issue type, Issue key",
          "fieldType": "string"
        },
        {
          "value": "",
          ...getImageUrlObject(issue.priorityUrl),
          "tooltip": "Priority",
          "fieldType": "string"
        },
        {
          "value": issue.assigneeName || 'Unassigned',
          ...getImageUrlObject(issue.avatarUrl),
          "tooltip": "Assignee",
          "fieldType": "string",
          "roundedIcon": true
        }
      ],
      "logo": {
        "iconUrl": "data:image/svg+xml;utf8,<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <image xlink:href=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGcgb3BhY2l0eT0iLjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIGZpbGw9ImN1cnJlbnRDb2xvciI+CiAgICAgICAgPHBhdGggZD0iTSAyMC4wOTM3NSAwLjE4NzUgTCA4LjkwNjI1IDEyLjE4NzUgTCAxMi4xODc1IDExLjY4NzUgTCA4IDE3LjkwNjI1IEwgMTEuMTg3NSAxNy41IEwgNS44MTI1IDI2IEwgMTYuNjg3NSAxNC44MTI1IEwgMTMuNDA2MjUgMTUuMDkzNzUgTCAxOC41IDguNTkzNzUgTCAxNC41IDkuNjg3NSBaIE0gMTMgMyBDIDcuNSAzIDMgNy41IDMgMTMgQyAzIDE2LjUgNC43MDcwMzEgMTkuNTExNzE5IDcuNDA2MjUgMjEuMzEyNSBDIDcuNjA1NDY5IDIwLjkxNDA2MyA3Ljg5NDUzMSAyMC40OTIxODggOC4wOTM3NSAyMC4wOTM3NSBDIDguMTk1MzEzIDE5Ljg5NDUzMSA4LjMxMjUgMTkuNzg5MDYzIDguMzEyNSAxOS42ODc1IEMgNi4yMTA5MzggMTguMTg3NSA0LjgxMjUgMTUuODAwNzgxIDQuODEyNSAxMyBDIDQuODEyNSA4LjUgOC40MDYyNSA0LjkwNjI1IDEyLjkwNjI1IDQuOTA2MjUgQyAxMy4zMDQ2ODggNC45MDYyNSAxMy42ODc1IDQuODk4NDM4IDE0LjE4NzUgNSBMIDE1LjY4NzUgMy40MDYyNSBDIDE0Ljg4NjcxOSAzLjEwNTQ2OSAxNCAzIDEzIDMgWiBNIDE4LjU5Mzc1IDQuNjg3NSBMIDE3LjU5Mzc1IDYuMzEyNSBDIDE5LjY5NTMxMyA3LjgxMjUgMjEuMDkzNzUgMTAuMTk5MjE5IDIxLjA5Mzc1IDEzIEMgMjEuMDkzNzUgMTcuNSAxNy41IDIxLjA5Mzc1IDEzIDIxLjA5Mzc1IEMgMTIuNjk5MjE5IDIxLjA5Mzc1IDEyLjMwMDc4MSAyMS4xMDE1NjMgMTIgMjEgTCAxMC40MDYyNSAyMi41OTM3NSBDIDExLjIwNzAzMSAyMi43OTI5NjkgMTIuMTAxNTYzIDIyLjkwNjI1IDEzIDIyLjkwNjI1IEMgMTguNSAyMi45MDYyNSAyMyAxOC40MDYyNSAyMyAxMi45MDYyNSBDIDIzIDkuNTA3ODEzIDIxLjE5NTMxMyA2LjQ4ODI4MSAxOC41OTM3NSA0LjY4NzUgWiIgc3R5bGU9IiYjMTA7Ii8+CiAgICA8L2c+Cjwvc3ZnPg==\" x=\"0\" y=\"0\" height=\"24\" width=\"24\"/> </svg>"
      }
    }
  }
  
  // console.log(card)
  return card
}

function getImageUrlObject(url) {
  return url && {"iconUrl": host + encodeURIComponent(url)}
}