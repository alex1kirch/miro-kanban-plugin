import {APP_ID, JIRA_ICON_URL} from 'config'

const host = 'https://miro-kanban-plugin.glitch.me/jira/image?url='

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
        "iconUrl": JIRA_ICON_URL
      }
    }
  }
  
  if (issue.description) {
    card.description = issue.description
  }
  
  return card
}

function getImageUrlObject(url) {
  return url && {"iconUrl": host + encodeURIComponent(url)}
}