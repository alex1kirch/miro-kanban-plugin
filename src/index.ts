import {ICON_24} from 'config'
import {createFromUrl} from 'kanban'
import {checkJiraBoardUrl} from 'jira'

miro.onReady(async () => {
  let extensionPoints = {};
  // const params = await miro.board.__getParamsFromURL();
  const permissions = await miro.currentUser.getCurrentBoardPermissions();
  const isAuthorized = await miro.isAuthorized();
  const canEditBoard = permissions.includes("EDIT_CONTENT");
  
  if (canEditBoard && isAuthorized) {
    // TODO
  } else {
    //kill plugin
  }

  miro.initialize({
    extensionPoints: extensionPoints
  });
  
  miro.addListener('WIDGETS_CREATED', widgetCreated);
});

// TODO rewrite to work with paste buffer
async function widgetCreated(event: SDK.Event) {
  const newWidget: SDK.Widget[] = event.data[0]
  if (newWidget && newWidget.type === "PREVIEW") {
    if (newWidget.url) {
      if (checkJiraBoardUrl(newWidget.url)) {
        event.preventDefault()
        createFromUrl(newWidget.url)
        await miro.board.widgets.deleteById(newWidget.id)
      }
    }
    // HACK: platforn dont allow to get url data from event
    else { 
      const widgetForCheckUrl = (await miro.board.widgets.get({ id: newWidget.id }))[0]
      if (widgetForCheckUrl && widgetForCheckUrl.url && checkJiraBoardUrl(widgetForCheckUrl.url)) {
        await miro.board.widgets.deleteById(widgetForCheckUrl.id)
        createFromUrl(widgetForCheckUrl.url)
      }
    }
  }
}
