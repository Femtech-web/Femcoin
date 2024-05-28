import WebSocket from 'ws';
import Message from '../../../entities/interfaces/message.interface';

export default class TransportMessage {
  sockets: WebSocket[]
  constructor(sockets: WebSocket[]) {
    this.sockets = sockets
  }
  write = (ws: WebSocket, message: Message): void => ws.send(JSON.stringify(message));
  broadcast = (message: Message): void => this.sockets.forEach((socket) => this.write(socket, message));

}