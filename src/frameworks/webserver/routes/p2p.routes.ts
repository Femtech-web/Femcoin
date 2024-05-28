import Express from 'express';
import WebSocket from 'ws';
import p2pController from '../../../adapters/controllers/p2p.controller';
import socketGatewayImpl from '../../../adapters/gateways/socketGatewayImpl';

export default function p2pRouter(
  express: typeof Express,
  sockets: WebSocket[],
  socketService: any
) {
  const router = express.Router();
  const socketGateway = new socketGatewayImpl(sockets, socketService);

  // load controller with dependencies
  const controller = new p2pController();


  // POST endpoint
  // router.route('/')
  //   .post(
  //     [
  //       requirePasswordExists,
  //       requireEmailExists
  //     ], validatorErrorHandler, controller.loginUser);

  return router;
}
