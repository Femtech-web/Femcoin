import Block from '../../../entities/block';
import {
  DIFFICULTY_ADJUSTMENT_INTERVAL,
  BLOCK_GENERATION_INTERVAL
} from '../../constants/blockchain.const';
import { BlockGateway } from "./interfaces/blockGateway";

export default class CalculateDifficulty {
  public blockchain: Block[];

  constructor(private blockGateway: BlockGateway) {
    this.blockchain = this.blockGateway.getBlockchain()
  }

  public getAccumulatedDifficulty = (aBlockchain: Block[]): number => {
    return aBlockchain
      .map((block) => block.difficulty)
      .map((difficulty) => Math.pow(2, difficulty))
      .reduce((a, b) => a + b);
  };

  public getDifficulty(aBlockchain: Block[]): number {
    const latestBlock: Block = aBlockchain[this.blockchain.length - 1];
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
      return this.getAdjustedDifficulty(latestBlock, aBlockchain);
    } else {
      return latestBlock.difficulty;
    }
  };

  public getAdjustedDifficulty(latestBlock: Block, aBlockchain: Block[]) {
    const prevAdjustmentBlock: Block = aBlockchain[this.blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken: number = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    if (timeTaken < timeExpected / 2) {
      return prevAdjustmentBlock.difficulty + 1;
    } else if (timeTaken > timeExpected * 2) {
      return prevAdjustmentBlock.difficulty - 1;
    } else {
      return prevAdjustmentBlock.difficulty;
    }
  };
}