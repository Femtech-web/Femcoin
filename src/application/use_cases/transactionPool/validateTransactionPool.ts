import * as _ from 'lodash';
import Transaction from "../../../entities/transaction";
import { TxIn } from "../../../entities/transaction";

export default class CheckTxValidForPool {
  public static execute(tx: Transaction, aTtransactionPool: Transaction[]): boolean {
    const thisInstance = new CheckTxValidForPool();
    const txPoolIns: TxIn[] = thisInstance.getTxPoolIns(aTtransactionPool);

    const containsTxIn = (txIns: TxIn[], txIn: TxIn) => {
      return _.find(txPoolIns, ((txPoolIn) => {
        return txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId;
      }));
    };

    for (const txIn of tx.txIns) {
      if (containsTxIn(txPoolIns, txIn)) {
        console.log('txIn already found in the txPool');
        return false;
      }
    }
    return true;
  };

  private getTxPoolIns(aTransactionPool: Transaction[]): TxIn[] {
    return _.chain(aTransactionPool)
      .map((tx: Transaction) => tx.txIns)
      .flatten()
      .value();
  };
}