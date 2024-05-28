import WebSocket from 'ws';
import connection from '../../frameworks/websocket/connection';

export default class SocketConnection {
  private sockets: WebSocket[];
  private socketService: any;

  constructor(sockets: WebSocket[], socketService: any) {
    this.sockets = sockets;
    this.socketService = socketService;
  }

  initConnection(ws: WebSocket) {
    connection(this.sockets, this.socketService).initConnection(ws);
  }

  getSockets(): WebSocket[] {
    return this.sockets;
  }
}