import { BlockGateway } from './interfaces/blockGateway';

export default class GetAllBlocks {
  constructor(private blockGateway: BlockGateway) { }

  async execute() {
    const allBlocks = await this.blockGateway.getBlockchain();

    return allBlocks;
  };
}