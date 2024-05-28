import * as _ from 'lodash';
import { UnspentTxOut, TxIn } from "../../entities/transaction";

export default class TransactionService {
  static findUnspentTxOut(transactionId: string, index: number, aUnspentTxOuts: UnspentTxOut[]): UnspentTxOut {
    const found = aUnspentTxOuts.find((uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index);
    if (!found) {
      throw new Error(`UnspentTxOut not found for transactionId: ${transactionId}, index: ${index}`);
    }

    return found
  };

  static findUnspentTxOuts(ownerAddress: string, unspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
    return unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === ownerAddress);
  };

  static hasTxIn(txIn: TxIn, unspentTxOuts: UnspentTxOut[]): boolean {
    const foundTxIn = unspentTxOuts.find((uTxO: UnspentTxOut) => {
      return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex;
    });
    return foundTxIn !== undefined;
  };
}