import * as _ from 'lodash';
import Transaction, { UnspentTxOut, TxIn } from "../../../entities/transaction";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";
import TransactionService from '../../services/transactionService';

export default class UpdateTransactionPool {
  constructor(private transactionGateway: TransactionGateway) { }

  public async execute(unspentTxOuts: UnspentTxOut[]) {
    const transactionPool = await this.transactionGateway.getTransactionPool();

    const invalidTxs = [];
    for (const tx of transactionPool) {
      for (const txIn of tx.txIns) {
        if (!TransactionService.hasTxIn(txIn, unspentTxOuts)) {
          invalidTxs.push(tx);
          break;
        }
      }
    }
    if (invalidTxs.length > 0) {
      console.log('removing the following transactions from txPool: %s', JSON.stringify(invalidTxs));
      const newPool: Transaction[] = _.without(transactionPool, ...invalidTxs);
      this.transactionGateway.setTransactionPool(newPool);
    }
  };

}