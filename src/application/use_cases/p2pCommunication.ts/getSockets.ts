import { SocketGateway } from './interfaces/socketGateway.interface';

export default class GetSockets {
  constructor(private socketGateway: SocketGateway) { }

  async execute() {
    const sockets = this.socketGateway.getSockets();

    const peers = sockets.map(
      (s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort
    );
    return peers;
  }
}