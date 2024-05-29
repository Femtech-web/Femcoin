import { BlockInterface } from "../../../../entities/interfaces/block.interface";

export interface BlockGateway {
  add(block: BlockInterface): Promise<void>;
  getLastBlock(): Promise<BlockInterface>;
  getBlockchain(): Promise<BlockInterface[]>;
  replaceBlockchain(newChain: BlockInterface[]): Promise<BlockInterface[]>;
}
