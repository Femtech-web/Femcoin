import Express from 'express';
import WebSocket from 'ws';
import blockchainRouter from "./blockchain.routes";
import transactionRouter from './transaction.routes';
import p2pRouter from './p2p.routes';
import walletRouter from './wallet.routes';
import Block from '../../../entities/block';
import Transaction, { UnspentTxOut } from '../../../entities/transaction';

export default function routes(
  app: Express.Application,
  express: typeof Express,
  blockchain: Block[],
  sockets: WebSocket[],
  unspentTxOut: UnspentTxOut[],
  transactionPool: Transaction[],
  socketService: any
) {
  app.use("/api/blockchain", blockchainRouter(express, blockchain, sockets, unspentTxOut, transactionPool));
  app.use("/api/transaction", transactionRouter(express, blockchain, unspentTxOut, transactionPool));
  app.use("/api/p2p", p2pRouter(express, sockets, socketService));
  app.use("/api/wallet", walletRouter(express));
}
