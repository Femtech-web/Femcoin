import Block from "../../../entities/block";
import ValidateBlock from "../blockchain/validateBlock";
import { BlockGateway } from "../blockchain/interfaces/blockGateway";
import ReplaceChain from "../blockchain/replaceChain";
import AddBlockToBlockchain from "../blockchain/addBlockToBlockchain";
import TransportMessage from "./transportMessage";
import MessagesFormat from "./dataType";

export default class HandleResponse {
  constructor(
    private blockGateway: BlockGateway,
    private addBlockToChain: AddBlockToBlockchain,
    private replaceChain: ReplaceChain,
    private transportService: TransportMessage,
    private dataType: MessagesFormat
  ) { }

  async execute(receivedBlocks: Block[]) {
    if (receivedBlocks.length === 0) {
      console.log('received block chain size of 0');
      return;
    }
    const latestBlockReceived: Block = receivedBlocks[receivedBlocks.length - 1];
    if (!ValidateBlock.isValidBlockStructure(latestBlockReceived)) {
      console.log('block structure not valid');
      return;
    }
    const latestBlockHeld: Block = await this.blockGateway.getLastBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
      console.log('blockchain possibly behind. We got: '
        + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        if (await this.addBlockToChain.execute(latestBlockReceived)) {
          this.transportService.broadcast(this.dataType.responseLatestMsg());
        }
      } else if (receivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer');
        this.transportService.broadcast(this.dataType.queryAllMsg());
      } else {
        console.log('Received blockchain is longer than current blockchain');
        await this.replaceChain.execute(receivedBlocks);
      }
    } else {
      console.log('received blockchain is not longer than received blockchain. Do nothing');
    }
  };

}