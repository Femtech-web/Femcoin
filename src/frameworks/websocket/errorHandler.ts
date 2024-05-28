import WebSocket from 'ws';

export default function initErrorHandler(ws: WebSocket, sockets: WebSocket[]) {
  const closeConnection = (myWs: WebSocket) => {
    console.log('connection failed to peer: ' + myWs.url);
    sockets.splice(sockets.indexOf(myWs), 1);
  };
  ws.on('close', () => closeConnection(ws));
  ws.on('error', () => closeConnection(ws));
};