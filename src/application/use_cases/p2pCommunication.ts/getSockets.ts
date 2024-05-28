import { SocketGateway } from './interfaces/socketGateway.interface';

export default class GetSockets {
  constructor(private socketGateway: SocketGateway) { }

  execute() {
    return this.socketGateway.getSockets();
  }
}