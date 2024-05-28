import Transaction, { UnspentTxOut } from "../../../entities/transaction";
import ValidatePool from './validateTransactionPool';
import ValidateTransaction from '../transaction/validateTransaction';
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";

export default class AddToTransactionPool {
  constructor(private transactionGateway: TransactionGateway) { };

  async execute(tx: Transaction, unspentTxOuts: UnspentTxOut[]) {
    const transactionPool = await this.transactionGateway.getTransactionPool();

    if (!ValidateTransaction.execute(tx, unspentTxOuts)) {
      throw Error('Trying to add invalid tx to pool');
    }

    if (!ValidatePool.execute(tx, transactionPool)) {
      throw Error('Trying to add invalid tx to pool');
    }
    console.log('adding to txPool: %s', JSON.stringify(tx));
    await this.transactionGateway.addToTransactionPool(tx)
  };
}  