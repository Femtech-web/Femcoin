import Transaction from "../../../entities/transaction";
import Block from "../../../entities/block";
import AddBlockToChain from './addBlockToBlockchain';
import CalculateDifficulty from './calculateDifficulty';
import { BlockGateway } from "./interfaces/blockGateway";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";
import UtilsService from '../../../utils';
import FindBlock from './findNounce';

export default class {
  constructor(
    private addBlockToChain: AddBlockToChain,
    private difficultyService: CalculateDifficulty,
    private blockGateway: BlockGateway,
    private transactionGateway: TransactionGateway,
  ) { }

  public async execute(blockData: Transaction[]) {
    const blockchain = this.blockGateway.getBlockchain()

    const previousBlock = await this.blockGateway.getLastBlock();
    const difficulty: number = this.difficultyService.getDifficulty(blockchain);
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = UtilsService.getCurrentTimestamp();
    const newBlock: Block = FindBlock.execute(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    if (await this.addBlockToChain.execute(newBlock)) {
      // broadcastLatest();
      return newBlock;
    } else {
      return null;
    }

  };
}