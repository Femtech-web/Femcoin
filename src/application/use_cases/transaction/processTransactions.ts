import * as _ from 'lodash';
import Transaction from "../../../entities/transaction";
import { UnspentTxOut, TxIn } from "../../../entities/transaction";
import ValidateTransaction from "./validateTransaction";
import UpdateUnspentTxOuts from "./updateUnspentTxOuts";
import ValidateCoinbaseTx from "./validateCoinbaseTransaction";

export default class ProcessTransactions {
  constructor() { }
  public static execute(aTransactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number) {
    const thisInstance = new ProcessTransactions();

    if (!thisInstance.validateBlockTransactions(aTransactions, aUnspentTxOuts, blockIndex)) {
      console.log('invalid block transactions');
      throw new Error('Failed to process transactions: result is null');
    }
    return UpdateUnspentTxOuts.execute(aTransactions, aUnspentTxOuts);
  };

  private validateBlockTransactions(aTransactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number): boolean {
    const coinbaseTx = aTransactions[0];
    if (!ValidateCoinbaseTx.execute(coinbaseTx, blockIndex)) {
      console.log('invalid coinbase transaction: ' + JSON.stringify(coinbaseTx));
      return false;
    }

    // check for duplicate txIns. Each txIn can be included only once
    const txIns: TxIn[] = _.chain(aTransactions)
      .map((tx) => tx.txIns)
      .flatten()
      .value();

    if (this.hasDuplicates(txIns)) {
      return false;
    }

    // all but coinbase transactions
    const normalTransactions: Transaction[] = aTransactions.slice(1);
    return normalTransactions.map((tx) => ValidateTransaction.execute(tx, aUnspentTxOuts))
      .reduce((a, b) => (a && b), true);

  };

  public hasDuplicates(txIns: TxIn[]): boolean {
    const groups = _.countBy(txIns, (txIn: TxIn) => txIn.txOutId + txIn.txOutIndex);
    return _.map(groups, (value, key) => {
      if (value > 1) {
        console.log('duplicate txIn: ' + key);
        return true;
      } else {
        return false;
      }
    })
      .includes(true);
  };
}