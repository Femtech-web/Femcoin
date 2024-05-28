import Express from 'express'
import Transaction, { UnspentTxOut } from './../../../entities/transaction';
import AddBlock from "../../../application/use_cases/blockchain/replaceChain";
import TransactionController from '../../../adapters/controllers/transaction.controller'
import { TransactionGatewayImpl } from "../../../adapters/gateways/transactionGatewayImpl";

export default function transactionRouter(
  express: typeof Express,
  unspentTxOuts: UnspentTxOut[],
  transactionPool: Transaction[]
) {
  const router = express.Router();
  const transactionGateway = new TransactionGatewayImpl(unspentTxOuts, transactionPool);

  // load controller with dependencies
  const controller = new TransactionController();


  // POST endpoint
  // router.route('/')
  //   .post(
  //     [
  //       requirePasswordExists,
  //       requireEmailExists
  //     ], validatorErrorHandler, controller.loginUser);

  return router;
}
