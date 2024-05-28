import TransportMessage from "./transportMessage";
import MessagesFormat from "./dataType";

export default class BroadcastLatest {
  constructor(
    private transportService: TransportMessage,
    private dataType: MessagesFormat
  ) { }
  execute(): void {
    this.transportService.broadcast(this.dataType.responseLatestMsg());
  };
}