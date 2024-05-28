import Message from "../../../entities/interfaces/message.interface";
import { MessageType } from "../../enums/messageType.enum";
import { BlockGateway } from "../blockchain/interfaces/blockGateway";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";

export default class MessagesFormat {
  constructor(
    private blockGateway: BlockGateway,
    private transactionGateway: TransactionGateway,
  ) { }
  public queryChainLengthMsg = (): Message => ({ 'type': MessageType.QUERY_LATEST, 'data': null });

  public queryAllMsg = (): Message => ({ 'type': MessageType.QUERY_ALL, 'data': null });

  public responseChainMsg = (): Message => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(this.blockGateway.getBlockchain())
  });

  public responseLatestMsg = (): Message => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([this.blockGateway.getLastBlock()])
  });

  public queryTransactionPoolMsg = (): Message => ({
    'type': MessageType.QUERY_TRANSACTION_POOL,
    'data': null
  });

  public responseTransactionPoolMsg = (): Message => ({
    'type': MessageType.RESPONSE_TRANSACTION_POOL,
    'data': JSON.stringify(this.transactionGateway.getTransactionPool())
  });
}