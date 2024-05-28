import Block from "../../../entities/block";
import UtilsService from "../../../utils";
import BlockService from "../../services/blockServices";

export default class ValidateBlock {
  static isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
      && typeof block.hash === 'string'
      && typeof block.previousHash === 'string'
      && typeof block.timestamp === 'number'
      && typeof block.data === 'object';
  };

  static isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if (!this.isValidBlockStructure(newBlock)) {
      console.log('invalid block structure: %s', JSON.stringify(newBlock));
      return false;
    }
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index');
      return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash');
      return false;
    } else if (!this.isValidTimestamp(newBlock, previousBlock)) {
      console.log('invalid timestamp');
      return false;
    } else if (!this.hasValidHash(newBlock)) {
      return false;
    }
    return true;
  };

  static isValidChain(blockchainToValidate: Block[]) {
    console.log('isValidChain:');
    console.log(JSON.stringify(blockchainToValidate));
    const isValidGenesis = (block: Block): boolean => {
      return JSON.stringify(block) === JSON.stringify(blockchainToValidate[0]);
    };

    if (!isValidGenesis(blockchainToValidate[0])) {
      return null;
    }
    /*
    Validate each block in the chain. The block is valid if the block structure is valid
      and the transaction are valid
     */

    for (let i = 0; i < blockchainToValidate.length; i++) {
      const currentBlock: Block = blockchainToValidate[i];
      if (i !== 0 && !this.isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
        return null;
      }
    }
  };

  static isValidTimestamp = (newBlock: Block, previousBlock: Block): boolean => {
    return (previousBlock.timestamp - 60 < newBlock.timestamp)
      && newBlock.timestamp - 60 < UtilsService.getCurrentTimestamp();
  };

  static hasValidHash = (block: Block): boolean => {

    if (!this.hashMatchesBlockContent(block)) {
      console.log('invalid hash, got:' + block.hash);
      return false;
    }

    if (!ValidateBlock.hashMatchesDifficulty(block.hash, block.difficulty)) {
      console.log('block difficulty not satisfied. Expected: ' + block.difficulty + 'got: ' + block.hash);
    }
    return true;
  };

  static hashMatchesBlockContent = (block: Block): boolean => {
    const blockHash: string = BlockService.calculateHashForBlock(block);
    return blockHash === block.hash;
  };

  static hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
    const hashInBinary: string = UtilsService.hexToBinary(hash) as string;
    const requiredPrefix: string = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
  };
}