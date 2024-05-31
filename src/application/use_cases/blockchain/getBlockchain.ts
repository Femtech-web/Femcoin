import { BlockGateway } from './interfaces/blockGateway';

export default class GetAllBlocks {
  constructor(private blockGateway: BlockGateway) { }

  async execute() {
    const allBlocks = this.blockGateway.getBlockchain();

    return allBlocks;
  };
}