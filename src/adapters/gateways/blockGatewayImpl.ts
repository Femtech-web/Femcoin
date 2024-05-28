import { BlockGateway } from "../../application/use_cases/blockchain/interfaces/blockGateway";
import Block from "../../entities/block";
import { BlockInterface } from "../../entities/interfaces/block.interface";

export class BlockGatewayImpl implements BlockGateway {
  private blockchain: Block[];

  constructor(blockchain: Block[]) {
    this.blockchain = blockchain;
  }

  async add(block: BlockInterface): Promise<void> {
    this.blockchain.push(block as Block);
  }

  async getLastBlock(): Promise<Block> {
    return this.blockchain[this.blockchain.length - 1];
  }

  getBlockchain(): BlockInterface[] {
    return this.blockchain;
  }

  async replaceBlockchain(newChain: Block[]): Promise<BlockInterface[]> {
    return this.blockchain = newChain;
  }
}
