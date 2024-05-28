import { BlockGateway } from "./interfaces/blockGateway";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";
import Block from "../../../entities/block";
import { UnspentTxOut } from "../../../entities/transaction";
import ProcessTransactions from "../transaction/processTransactions";
import ValidateBlock from "./validateBlock";
import UpdateTransactionPool from '../transactionPool/updateTransactionPool';

export default class AddBlockToBlockchain {
  public blockchain: Block[];

  constructor(
    private blockGateway: BlockGateway,
    private transactionGateway: TransactionGateway,
    private updateTransactionPool: UpdateTransactionPool) {
    this.blockchain = this.blockGateway.getBlockchain()
  }

  async execute(newBlock: Block): Promise<boolean> {
    const latestBlock = (await this.blockGateway.getLastBlock());

    const unspentTxOuts = await this.transactionGateway.getUnspentTxOuts();

    if (ValidateBlock.isValidNewBlock(newBlock, latestBlock)) {
      const retVal: UnspentTxOut[] = ProcessTransactions.execute(newBlock.data, unspentTxOuts, newBlock.index);
      if (retVal === null) {
        console.log('block is not valid in terms of transactions');
        return false;
      } else {
        this.blockchain.push(newBlock);
        this.transactionGateway.setUnspentTxOuts(retVal);
        this.updateTransactionPool.execute(unspentTxOuts);
        return true;
      }
    }
    return false;
  };
}