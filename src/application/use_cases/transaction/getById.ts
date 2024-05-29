import * as _ from 'lodash';
import { BlockGateway } from '../blockchain/interfaces/blockGateway';

export default class GetTransactionById {
  constructor(private blockGateway: BlockGateway) { }

  async execute(txId: string) {
    const allBlocks = await this.blockGateway.getBlockchain();
    const transactionWithId = _.chain(allBlocks)
      .map((blocks) => blocks.data)
      .flatten()
      .find({ 'id': txId });

    return transactionWithId;
  };
}