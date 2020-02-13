import {ICON_24} from 'config'
import {createFromUrl} from 'kanban'

miro.onReady(async () => {
  let extensionPoints = {};
  // const params = await miro.board.__getParamsFromURL();
  const permissions = await miro.currentUser.getCurrentBoardPermissions();
  const isAuthorized = await miro.isAuthorized();
  const canEditBoard = permissions.includes("EDIT_CONTENT");
  
  if (canEditBoard && isAuthorized) {
    extensionPoints = {
      bottomBar: {
        title: "Miro kanban plugin",
        svgIcon: ICON_24,
        onClick: () => {
					// miro.board.ui.openBottomPanel('bottom-panel.html', {width: EDIT_WIDTH})
        }
      }
    };
  } else {
    //kill plugin
  }

  miro.initialize({
    extensionPoints: extensionPoints
  });
  
  // miro.addListener('WIDGETS_TRANSFORMATION_UPDATED', jiraTransformationUpdate);
  // miro.addListener('WIDGETS_TRANSFORMATION_UPDATED', jiraTransformationUpdate);
  miro.addListener('WIDGETS_CREATED', widgetCreated);
});

async function widgetCreated(event: SDK.Event) {
  const newWidget: SDK.Widget[] = event.data[0]
  if (newWidget && newWidget.type === "PREVIEW") {
      const widgetForCheckUrl = (await miro.board.widgets.get({ id: newWidget.id }))[0]
      if (widgetForCheckUrl && widgetForCheckUrl.url && checkJiraBoardUrl(widgetForCheckUrl.url)){
        await miro.board.widgets.deleteById(widgetForCheckUrl.id)
        createFromUrl(widgetForCheckUrl.url)
      }
  }
}

function checkJiraBoardUrl(url: string) {
  return url.startsWith("https://miro-platform-plugin-tasks.atlassian.net/secure/RapidBoard.jspa?rapidView=1") 
}