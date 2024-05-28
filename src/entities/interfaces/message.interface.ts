import { MessageType } from "../../application/enums/messageType.enum";

export default class Message {
  public type: MessageType | undefined;
  public data: any;
}
