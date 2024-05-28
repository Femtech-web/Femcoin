import Transaction from "./transaction";
import BlockService from "../application/services/blockServices";

export default class Block {

  public index: number;
  public hash: string;
  public previousHash: string;
  public timestamp: number;
  public data: Transaction[];
  public difficulty: number;
  public nonce: number;

  constructor(index: number, hash: string, previousHash: string,
    timestamp: number, data: Transaction[], difficulty: number, nonce: number) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  static createGenesisBlock(): Block {
    const genesisTransaction = {
      'txIns': [{ 'signature': '', 'txOutId': '', 'txOutIndex': 0 }],
      'txOuts': [{
        'address': '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a',
        'amount': 50
      }],
      'id': 'e655f6a5f26dc9b4cac6e46f52336428287759cf81ef5ff10854f69d68f43fa3'
    };

    const genesisBlock: Block = new Block(
      0, '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1465154705, [genesisTransaction], 0, 0
    );

    genesisBlock.hash = BlockService.calculateHashForBlock(genesisBlock);
    return genesisBlock;
  }
}
