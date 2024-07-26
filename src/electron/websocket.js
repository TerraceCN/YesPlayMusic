import { ipcMain } from 'electron';
import { Express } from 'express';
import expressWs from 'express-ws';

/**
 * 创建 Websocket 接口
 * @param {Express} expressApp
 */
export function createWebsocket(that, expressApp) {
  expressWs(expressApp);
  
  expressApp.ws('/ws', function (ws, req) {
    
    ws.on('message', function (msg) {
      if (that.window === undefined) {
        console.warning('Window not created, please connect later');
        ws.close(1011);
        return;
      }

      try {
        const data = JSON.parse(msg);
        switch (data.action) {
          case 'play':
            renderer.send('play');
            break;
          case 'previous':
            renderer.send('previous');
            break;
          case 'next':
            renderer.send('next');
            break;
          case 'like':
            renderer.send('like');
            break;
          case 'update':
            renderer.send('sendWs');
            break;
          default:
            console.log('Unknown action:', data.action)
            break;
        } 
      } catch (error) {
        console.log(error);
      }
    });

    ipcMain.on('player', (e, data) => {
      ws.send(JSON.stringify(data));
    });

    ipcMain.on('updateWs', (e, data) => {
      ws.send(JSON.stringify(data));
    });

    ipcMain.on('playerCurrentTrackTime', (e, data) => {
      ws.send(JSON.stringify({playerCurrentTrackTime: data}));
    })

  });
}
