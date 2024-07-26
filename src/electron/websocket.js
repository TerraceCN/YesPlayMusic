import { ipcMain } from 'electron';
import { Express } from 'express';
import expressWs from 'express-ws';

/**
 * 创建 Websocket 接口
 * @param {Express} expressApp
 */
export function createWebsocket(expressApp) {
  expressWs(expressApp);

  expressApp.ws('/ws', function (ws, req) {
    console.log(`Websocket connected, from: ${req.ip}`);
    ws.on('message', function (msg) {
      console.log(msg);
    });

    ipcMain.on('player', (e, data) => {
      ws.send(JSON.stringify(data));
    });
    ipcMain.on('updateWebsocket', (e, data) => {
      ws.send(data);
    });
  });
}
