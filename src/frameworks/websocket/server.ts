import WebSocket from 'ws';
import { Server } from 'ws';
import connection from './connection';

export default function initP2PServer(p2pPort: number, sockets: WebSocket[], socketService: any) {
  const server: Server = new WebSocket.Server({ port: p2pPort });
  server.on('connection', (ws: WebSocket) => {
    connection(sockets, socketService).initConnection(ws);
  });
  console.log('websocket p2p is listening on port: ' + p2pPort);
};