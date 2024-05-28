import WebSocket from 'ws';
import Block from '../../../entities/block';
import Transaction from '../../../entities/transaction';
import Message from '../../../entities/interfaces/message.interface';
import { MessageType } from '../../../application/enums/messageType.enum';
import UtilsService from '../../../utils';

export default function initMessageHandler(ws: WebSocket, socketService: any, sockets: WebSocket[]) {
  const {
    handleBlockchainResponse,
    handleReceivedTransaction,
    broadcastTransactionPool,
    transportMessage,
    dataType
  } = socketService;

  ws.on('message', (data: string) => {

    try {
      const message: Message | null = UtilsService.JSONToObject<Message>(data);
      if (message === null) {
        console.log('could not parse received JSON message: ' + data);
        return;
      }
      console.log('Received message: %s', JSON.stringify(message));
      switch (message.type) {
        case MessageType.QUERY_LATEST:
          transportMessage.write(ws, dataType.responseLatestMsg());
          break;
        case MessageType.QUERY_ALL:
          transportMessage.write(ws, dataType.responseChainMsg());
          break;
        case MessageType.RESPONSE_BLOCKCHAIN:
          const receivedBlocks: Block[] | null = UtilsService.JSONToObject<Block[]>(message.data);
          if (receivedBlocks === null) {
            console.log('invalid blocks received: %s', JSON.stringify(message.data));
            break;
          }
          handleBlockchainResponse(receivedBlocks);
          break;
        case MessageType.QUERY_TRANSACTION_POOL:
          transportMessage.write(ws, dataType.responseTransactionPoolMsg());
          break;
        case MessageType.RESPONSE_TRANSACTION_POOL:
          const receivedTransactions: Transaction[] | null = UtilsService.JSONToObject<Transaction[]>(message.data);
          if (receivedTransactions === null) {
            console.log('invalid transaction received: %s', JSON.stringify(message.data));
            break;
          }
          receivedTransactions.forEach((transaction: Transaction) => {
            try {
              handleReceivedTransaction(transaction);
              // if no error is thrown, transaction was indeed added to the pool
              // let's broadcast transaction pool
              broadcastTransactionPool();
            } catch (e: any) {
              console.log(e.message);
            }
          });
          break;
      }
    } catch (e) {
      console.log(e);
    }
  });

};