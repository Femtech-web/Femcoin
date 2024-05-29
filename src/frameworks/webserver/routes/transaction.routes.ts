import Express from 'express';
import Block from '../../../entities/block';
import Transaction, { UnspentTxOut } from './../../../entities/transaction';
import TransactionController from '../../../adapters/controllers/transaction.controller';
import { TransactionGatewayImpl } from "../../../adapters/gateways/transactionGatewayImpl";
import { BlockGatewayImpl } from '../../../adapters/gateways/blockGatewayImpl';

import GetTransactionById from '../../../application/use_cases/transaction/getById';

export default function transactionRouter(
  express: typeof Express,
  blockchain: Block[],
  unspentTxOuts: UnspentTxOut[],
  transactionPool: Transaction[]
) {
  const router = express.Router();
  const transactionGateway = new TransactionGatewayImpl(unspentTxOuts, transactionPool);
  const blockGateway = new BlockGatewayImpl(blockchain)

  const getTransactionById = new GetTransactionById(blockGateway)

  // load controller with dependencies
  const controller = new TransactionController(
    getTransactionById
  );


  // POST endpoint
  router.route('/:id').post(controller.getSingleTransaction);

  return router;
}
