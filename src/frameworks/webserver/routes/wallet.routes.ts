import Express from 'express';
import Transaction, { UnspentTxOut } from '../../../entities/transaction';
import walletController from '../../../adapters/controllers/wallet.controller';
import { TransactionGatewayImpl } from '../../../adapters/gateways/transactionGatewayImpl';

import GetWalletBalance from '../../../application/use_cases/wallet/getBalance';

export default function walletRouter(
  express: typeof Express,
  unspentTxOuts: UnspentTxOut[],
  transactionPool: Transaction[],
) {
  const router = express.Router();
  const transactionGateway = new TransactionGatewayImpl(unspentTxOuts, transactionPool);

  const getWalletBalance = new GetWalletBalance(transactionGateway);

  // load controller with dependencies
  const controller = new walletController(getWalletBalance);


  // GET endpoint
  router.route('/balance').get(controller.getAccountBalance.bind(controller));
  router.route('/address').get(controller.getWalletAddress.bind(controller));

  return router;
}
