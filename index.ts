import express from "express";
import http from 'http';
import WebSocket from 'ws';
import config from './src/config';
import socketServer from "./src/frameworks/websocket/server";
import serverConfig from './src/frameworks/webserver/server';
import routes from './src/frameworks/webserver/routes/index';

import Block from "./src/entities/block";
import Transaction, { UnspentTxOut } from "./src/entities/transaction";
import ProcessTransactions from "./src/application/use_cases/transaction/processTransactions";
import WalletService from "./src/application/services/walletService";
import socketGateway from "./src/adapters/gateways/p2pGateway";

const app = express();
const server = http.createServer(app);

// Initialize the genesis block
const genesisBlock: Block = Block.createGenesisBlock();
let blockchain: Block[] = [genesisBlock as Block];

// initialize transactions and unspentOutputs list
let transactionPool: Transaction[] = [];
let unspentTxOuts: UnspentTxOut[] = ProcessTransactions.execute(blockchain[0].data, [], 0);

// initialize websocket
const sockets: WebSocket[] = [];
const socketService = socketGateway(blockchain, transactionPool, unspentTxOuts, sockets);
socketServer(8000, sockets, socketService);

// initialize wallet
WalletService.initWallet();

// server configuration
serverConfig(server, config);

// routes for each endpoint
routes(app, express, blockchain, sockets, unspentTxOuts, transactionPool, socketService);