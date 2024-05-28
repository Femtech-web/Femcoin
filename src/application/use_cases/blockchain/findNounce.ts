import Transaction from '../../../entities/transaction';
import Block from '../../../entities/block';
import BlockService from '../../services/blockServices';
import ValidationService from './validateBlock';

export default class FindBlock {
  static execute(index: number, previousHash: string, timestamp: number, data: Transaction[], difficulty: number): Block {
    let nonce = 0;
    while (true) {
      const hash: string = BlockService.calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
      if (ValidationService.hashMatchesDifficulty(hash, difficulty)) {
        return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
      }
      nonce++;
    }
  };
}