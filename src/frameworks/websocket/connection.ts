import WebSocket from 'ws';

import initErrorHandler from './errorHandler';
import initMessageHandler from './messageHandler'

export default function connection(sockets: WebSocket[], socketService: any) {
  const { dataType, transportMessage } = socketService;

  const initConnection = (ws: WebSocket) => {
    sockets.push(ws);
    initMessageHandler(ws, sockets, socketService);
    initErrorHandler(ws, sockets);
    transportMessage.write(ws, dataType.queryChainLengthMsg());

    // query transactions pool only some time after chain query
    setTimeout(() => {
      transportMessage.broadcast(dataType.queryTransactionPoolMsg());
    }, 500);
  };

  return {
    initConnection
  }
}

