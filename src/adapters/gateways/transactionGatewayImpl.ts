import * as _ from 'lodash';
import Transaction, { UnspentTxOut } from "../../entities/transaction";
import { TransactionGateway } from "../../application/use_cases/transaction/interfaces/transactionGateway";

export class TransactionGatewayImpl implements TransactionGateway {
  private unspentTxOuts: UnspentTxOut[];
  private transactionPool: Transaction[];

  constructor(unspentTxOuts: UnspentTxOut[], transactionPool: Transaction[]) {
    this.unspentTxOuts = unspentTxOuts;
    this.transactionPool = transactionPool;
  }

  async getUnspentTxOuts(): Promise<UnspentTxOut[]> {
    return _.cloneDeep(this.unspentTxOuts);
  }

  async getTransactionPool(): Promise<Transaction[]> {
    return _.cloneDeep(this.transactionPool);
  };

  async setUnspentTxOuts(newUnspentTxOut: UnspentTxOut[]): Promise<void> {
    console.log('replacing unspentTxouts with: %s', newUnspentTxOut);
    this.unspentTxOuts = newUnspentTxOut;
  };

  async setTransactionPool(newTransactionPool: Transaction[]): Promise<void> {
    this.transactionPool = newTransactionPool
  }

  async addToTransactionPool(newTransaction: Transaction): Promise<void> {
    this.transactionPool.push(newTransaction);
  }
}
