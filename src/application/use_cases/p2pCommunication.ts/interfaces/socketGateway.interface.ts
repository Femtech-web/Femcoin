import WebSocket from 'ws';

export interface SocketGateway {
  initConnection(ws: WebSocket): void;
  getSockets(): WebSocket[];
}
