import WebSocket from 'ws';
import { SocketGateway } from './interfaces/socketGateway.interface';

export default class ConnectToPeers {
  constructor(private socketGateway: SocketGateway) { }

  async execute(newPeer: string) {
    const ws: WebSocket = new WebSocket(newPeer);
    ws.on('open', () => {
      this.socketGateway.initConnection(ws);
    });
    ws.on('error', () => {
      console.log('connection failed');
    });
  };
}