import Express from 'express';
import WebSocket from 'ws';
import p2pController from '../../../adapters/controllers/p2p.controller';
import socketGatewayImpl from '../../../adapters/gateways/socketGatewayImpl';

import GetSockets from '../../../application/use_cases/p2pCommunication.ts/getSockets';
import ConnectToPeers from '../../../application/use_cases/p2pCommunication.ts/connectToPeers';

export default function p2pRouter(
  express: typeof Express,
  sockets: WebSocket[],
  socketService: any
) {
  const router = express.Router();
  const socketGateway = new socketGatewayImpl(sockets, socketService);

  const getPeers = new GetSockets(socketGateway);
  const connectToPeers = new ConnectToPeers(socketGateway);

  // load controller with dependencies
  const controller = new p2pController(getPeers, connectToPeers);

  // Get endpoint
  router.route('/peers').get(controller.getAllPeers.bind(controller));

  // POST endpoint
  router.route('/join').post(controller.joinPeers.bind(controller));

  return router;
}
