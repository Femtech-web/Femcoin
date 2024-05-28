import * as Crypto from 'crypto-js';
import Block from "../../entities/block";
import Transaction from "../../entities/transaction";

export default class BlockService {
  static calculateHashForBlock = (block: Block): string =>
    BlockService.calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce);

  static calculateHash = (index: number, previousHash: string, timestamp: number, data: Transaction[],
    difficulty: number, nonce: number): string =>
    Crypto.SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();
}
