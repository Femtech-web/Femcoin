import Express from 'express';
import WebSocket from 'ws';
import walletController from '../../../adapters/controllers/wallet.controller';
import socketGatewayImpl from '../../../adapters/gateways/socketGatewayImpl';

export default function walletRouter(
  express: typeof Express,
) {
  const router = express.Router();

  // load controller with dependencies
  const controller = new walletController();


  // POST endpoint
  // router.route('/')
  //   .post(
  //     [
  //       requirePasswordExists,
  //       requireEmailExists
  //     ], validatorErrorHandler, controller.loginUser);

  return router;
}
