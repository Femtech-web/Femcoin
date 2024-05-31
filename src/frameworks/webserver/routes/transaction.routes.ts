import Express from 'express';
import WebSocket from 'ws';
import Block from '../../../entities/block';
import Transaction, { UnspentTxOut } from './../../../entities/transaction';
import TransactionController from '../../../adapters/controllers/transaction.controller';
import { TransactionGatewayImpl } from "../../../adapters/gateways/transactionGatewayImpl";
import { BlockGatewayImpl } from '../../../adapters/gateways/blockGatewayImpl';

import AddToTransactionPool from '../../../application/use_cases/transactionPool/addToTransactionPool';
import BroadcastTxPool from '../../../application/use_cases/p2pCommunication.ts/broadcastTransactionPool';
import TransportMessage from '../../../application/use_cases/p2pCommunication.ts/transportMessage';
import MessagesFormat from '../../../application/use_cases/p2pCommunication.ts/dataType';

import GetTransactionById from '../../../application/use_cases/transaction/getById';
import GetMyUnspentTxOuts from '../../../application/use_cases/transaction/getMyUnspentTxOuts';
import GetAllUnspentTxOuts from '../../../application/use_cases/transaction/getAllUnpentTxOuts';
import SendTransaction from '../../../application/use_cases/transaction/sendTransaction';
import GetTransactionPool from '../../../application/use_cases/transactionPool/getTransactionPool';
import GetUnspentTxOutsByAddress from '../../../application/use_cases/transaction/getUnspentTxOutsByAddress';

export default function transactionRouter(
  express: typeof Express,
  blockchain: Block[],
  sockets: WebSocket[],
  unspentTxOuts: UnspentTxOut[],
  transactionPool: Transaction[]
) {
  const router = express.Router();
  const transactionGateway = new TransactionGatewayImpl(unspentTxOuts, transactionPool);
  const blockGateway = new BlockGatewayImpl(blockchain);

  const messagesFormat = new MessagesFormat(blockGateway, transactionGateway);
  const transportMessage = new TransportMessage(sockets)
  const addToTransactionPool = new AddToTransactionPool(transactionGateway);
  const broadcastTxPool = new BroadcastTxPool(transportMessage, messagesFormat);

  const getTransactionById = new GetTransactionById(blockGateway);
  const getMyUnspentTxOuts = new GetMyUnspentTxOuts(transactionGateway);
  const getAllUnpentTxOuts = new GetAllUnspentTxOuts(transactionGateway);
  const getUnspentTxOutsByAddress = new GetUnspentTxOutsByAddress(transactionGateway);
  const getTransactionPool = new GetTransactionPool(transactionGateway);
  const sendTransaction = new SendTransaction(transactionGateway, addToTransactionPool, broadcastTxPool);

  // load controller with dependencies
  const controller = new TransactionController(
    getTransactionById,
    getMyUnspentTxOuts,
    getAllUnpentTxOuts,
    sendTransaction,
    getTransactionPool,
    getUnspentTxOutsByAddress,
  );


  // GET endpoint
  router.route('/').get(controller.getTransactionPool.bind(controller));
  router.route('/:id').get(controller.getSingleTransaction.bind(controller));
  router.route('/unspentTxOuts/:address').get(controller.getSingleNodeUnspentTxOuts.bind(controller));
  router.route('/myUnspentTxOuts').get(controller.getMyUnspentTxOuts.bind(controller));
  router.route('/unspentTxOuts').get(controller.getUnspentTxOuts.bind(controller));

  // POST endpoint
  router.route('/').post(controller.makeTransaction.bind(controller));

  return router;
}
