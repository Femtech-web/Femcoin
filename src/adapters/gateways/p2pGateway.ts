import WebSocket from 'ws';
import Block from "../../entities/block";
import Transaction, { UnspentTxOut } from "../../entities/transaction";
import HandleResponse from "../../application/use_cases/p2pCommunication.ts/handleResponse";
import HandleReceivedTx from "../../application/use_cases/blockchain/handleReceivedTransaction";
import MessagesFormat from "../../application/use_cases/p2pCommunication.ts/dataType";
import BroadcastTxPool from "../../application/use_cases/p2pCommunication.ts/broadcastTransactionPool";

import { BlockGatewayImpl } from "./blockGatewayImpl";
import { TransactionGatewayImpl } from "./transactionGatewayImpl";
import ReplaceChain from "../../application/use_cases/blockchain/replaceChain";
import AddBlockToBlockchain from "../../application/use_cases/blockchain/addBlockToBlockchain";
import AddToTransactionPool from "../../application/use_cases/transactionPool/addToTransactionPool";
import UpdateTransactionPool from "../../application/use_cases/transactionPool/updateTransactionPool";
import CalculateDifficulty from "../../application/use_cases/blockchain/calculateDifficulty";
import TransportMessage from "../../application/use_cases/p2pCommunication.ts/transportMessage";

export default function p2pGateway(
  blockchain: Block[],
  transactionPool: Transaction[],
  unspentTxOuts: UnspentTxOut[],
  sockets: WebSocket[]
) {

  const handleBlockchainResponse = new HandleResponse(
    new BlockGatewayImpl(blockchain),
    new AddBlockToBlockchain(
      new BlockGatewayImpl(blockchain),
      new TransactionGatewayImpl(unspentTxOuts, transactionPool),
      new UpdateTransactionPool(new TransactionGatewayImpl(unspentTxOuts, transactionPool))
    ),
    new ReplaceChain(
      new BlockGatewayImpl(blockchain),
      new CalculateDifficulty(new BlockGatewayImpl(blockchain),)
    ),
    new TransportMessage(sockets),
    new MessagesFormat(
      new BlockGatewayImpl(blockchain),
      new TransactionGatewayImpl(unspentTxOuts, transactionPool),
    )
  );

  const handleReceivedTransaction = new HandleReceivedTx(
    new TransactionGatewayImpl(unspentTxOuts, transactionPool),
    new AddToTransactionPool(new TransactionGatewayImpl(unspentTxOuts, transactionPool),)
  );

  const broadcastTransactionPool = new BroadcastTxPool(
    new TransportMessage(sockets),
    new MessagesFormat(
      new BlockGatewayImpl(blockchain),
      new TransactionGatewayImpl(unspentTxOuts, transactionPool),
    )
  );

  const dataType = new MessagesFormat(
    new BlockGatewayImpl(blockchain),
    new TransactionGatewayImpl(unspentTxOuts, transactionPool),
  );

  const transportMessage = new TransportMessage(sockets);

  return {
    handleBlockchainResponse,
    handleReceivedTransaction,
    broadcastTransactionPool,
    transportMessage,
    dataType
  }
}