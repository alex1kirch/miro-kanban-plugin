import {icon24} from 'config'
import axios from 'axios'

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
        svgIcon: icon24,
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
});

axios.get('/jira/rest', { params: {
  query: '/rest/agile/1.0/board/1/configuration'
} })
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });