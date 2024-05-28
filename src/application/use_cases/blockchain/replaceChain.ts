import Block from "../../../entities/block";
import { BlockGateway } from "./interfaces/blockGateway";
import ValidateBlock from "./validateBlock";
import CalculateDifficulty from './calculateDifficulty';

export default class ReplaceChain {
  public blockchain: Block[];

  constructor(
    private blockGateway: BlockGateway,
    private difficulty: CalculateDifficulty) {
    this.blockchain = this.blockGateway.getBlockchain()
  }

  async execute(newBlocks: Block[]) {
    const aUnspentTxOuts = ValidateBlock.isValidChain(newBlocks);
    const validChain: boolean = aUnspentTxOuts !== null;
    if (validChain &&
      this.difficulty.getAccumulatedDifficulty(newBlocks) > this.difficulty.getAccumulatedDifficulty(this.blockchain)) {
      console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
      // blockchain = newBlocks; changed to below
      await this.blockGateway.replaceBlockchain(newBlocks)
      // setUnspentTxOuts(aUnspentTxOuts); from transaction
      // updateTransactionPool(unspentTxOuts); from transaction
      // broadcastLatest(); from p2p
    } else {
      console.log('Received blockchain invalid');
    }
  };


}
