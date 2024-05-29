import * as _ from 'lodash';
import { BlockGateway } from './interfaces/blockGateway';

export default class GetBlockByHash {
  constructor(private blockGateway: BlockGateway) { }

  async execute(hash: string) {
    const allBlocks = await this.blockGateway.getBlockchain();
    const blockWithHash = _.find(allBlocks, { 'hash': hash });

    return blockWithHash;
  };
}