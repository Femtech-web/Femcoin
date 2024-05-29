import Express from 'express'
import WebSocket from 'ws';
import BlockchainController from '../../../adapters/controllers/blockchain.controller'
import Block from "../../../entities/block";
import Transaction, { UnspentTxOut } from './../../../entities/transaction';
import { BlockGatewayImpl } from "../../../adapters/gateways/blockGatewayImpl";
import { TransactionGatewayImpl } from '../../../adapters/gateways/transactionGatewayImpl';

import BroadcastLatest from '../../../application/use_cases/p2pCommunication.ts/broadcastLatest';
import CalculateDifficulty from '../../../application/use_cases/blockchain/calculateDifficulty';
import UpdateTransactionPool from '../../../application/use_cases/transactionPool/updateTransactionPool';
import AddBlockToBlockchain from '../../../application/use_cases/blockchain/addBlockToBlockchain';
import TransportMessage from '../../../application/use_cases/p2pCommunication.ts/transportMessage';
import MessagesFormat from '../../../application/use_cases/p2pCommunication.ts/dataType';

import GetAllBlocks from '../../../application/use_cases/blockchain/getBlockchain';
import GetBlockByHash from '../../../application/use_cases/blockchain/getByHash';
import GenerateNextRawBlock from '../../../application/use_cases/blockchain/generateRawNextBlock';
import GenerateNextBlock from '../../../application/use_cases/blockchain/generateNextBlock';
import GenerateNextBlockWithTransaction from '../../../application/use_cases/blockchain/generateNextBlockWithTransactions';

export default function blockchainRouter(
  express: typeof Express,
  blockchain: Block[],
  sockets: WebSocket[],
  unspentTxOut: UnspentTxOut[],
  transactionPool: Transaction[],
) {
  const router = express.Router();

  const blockGateway = new BlockGatewayImpl(blockchain);
  const transactionGateway = new TransactionGatewayImpl(unspentTxOut, transactionPool);

  const messagesFormat = new MessagesFormat(blockGateway, transactionGateway);
  const transportMessage = new TransportMessage(sockets)
  const updateTransactionPool = new UpdateTransactionPool(transactionGateway);
  const calculateDifficulty = new CalculateDifficulty(blockGateway);
  const addBlockToBlockchain = new AddBlockToBlockchain(blockGateway, transactionGateway, updateTransactionPool);
  const broadcastLatest = new BroadcastLatest(transportMessage, messagesFormat);

  const getAllBlocks = new GetAllBlocks(blockGateway);
  const generateNextRawBlock = new GenerateNextRawBlock(
    addBlockToBlockchain,
    calculateDifficulty,
    blockGateway,
    broadcastLatest
  );
  const getBlockWithHash = new GetBlockByHash(blockGateway);
  const generateNextBlock = new GenerateNextBlock(blockGateway, transactionGateway, generateNextRawBlock);
  const generateNextBlockWithTransactions = new GenerateNextBlockWithTransaction(
    blockGateway,
    transactionGateway,
    generateNextRawBlock
  );

  // load controller with dependencies
  const controller = new BlockchainController(
    getAllBlocks,
    getBlockWithHash,
    generateNextRawBlock,
    generateNextBlock,
    generateNextBlockWithTransactions
  );

  // GET endpoint
  router.route('/').get(controller.getBlockchain);
  router.route('/:hash').get(controller.getSingleBlock);

  // POST endpoint
  router.route('/mineRawBlock').post(controller.mineRawBlock);
  router.route('/mineBlock').post(controller.mineBlock);
  router.route('/mineTransaction').post(controller.mineWithTransactions);

  return router;
}
