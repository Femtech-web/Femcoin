import TransportMessage from "./transportMessage";
import MessagesFormat from "./dataType";

export default class BroadcastTxPool {
  constructor(
    private transportService: TransportMessage,
    private dataType: MessagesFormat
  ) { }

  execute() {
    this.transportService.broadcast(this.dataType.responseTransactionPoolMsg());
  };

}