import Transaction from "../../../entities/transaction";
import Block from "../../../entities/block";
import AddBlockToChain from './addBlockToBlockchain';
import CalculateDifficulty from './calculateDifficulty';
import { BlockGateway } from "./interfaces/blockGateway";
import BroadcastLatest from "../p2pCommunication.ts/broadcastLatest";
import UtilsService from '../../../utils';
import FindBlock from './findNounce';

export default class GenerateNextRawBlock {
  constructor(
    private addBlockToChain: AddBlockToChain,
    private difficultyService: CalculateDifficulty,
    private blockGateway: BlockGateway,
    private broadcastLatest: BroadcastLatest,
  ) { }

  public async execute(blockData: Transaction[]) {
    const blockchain = await this.blockGateway.getBlockchain()

    const previousBlock = await this.blockGateway.getLastBlock();
    const difficulty: number = this.difficultyService.getDifficulty(blockchain);
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = UtilsService.getCurrentTimestamp();
    const newBlock: Block = FindBlock.execute(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    if (await this.addBlockToChain.execute(newBlock)) {
      this.broadcastLatest.execute();
      return newBlock;
    } else {
      return null;
    }
  };
}