import * as _ from 'lodash';
import Transaction from "../../../entities/transaction";
import { UnspentTxOut, TxIn, TxOut } from "../../../entities/transaction";
import CryptoService from "../../services/cryptoServices";
import SecureTransaction from './secureTransaction';

export default class CreateTransaction {
  public static execute(receiverAddress: string, amount: number, privateKey: string,
    unspentTxOuts: UnspentTxOut[], txPool: Transaction[]): Transaction {
    const thisInstance = new CreateTransaction()

    console.log('txPool: %s', JSON.stringify(txPool));
    const myAddress: string = CryptoService.getPublicKey(privateKey);
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === myAddress);

    const myUnspentTxOuts = thisInstance.filterTxPoolTxs(myUnspentTxOutsA, txPool);

    // filter from unspentOutputs such inputs that are referenced in pool
    const { includedUnspentTxOuts, leftOverAmount } = thisInstance.findTxOutsForAmount(amount, myUnspentTxOuts);

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(thisInstance.toUnsignedTxIn);

    const tx: Transaction = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = thisInstance.createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = SecureTransaction.getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
      txIn.signature = SecureTransaction.signTxIn(tx, index, privateKey, unspentTxOuts);
      return txIn;
    });

    return tx;
  };

  private toUnsignedTxIn(unspentTxOut: UnspentTxOut) {
    const txIn: TxIn = new TxIn();
    txIn.txOutId = unspentTxOut.txOutId;
    txIn.txOutIndex = unspentTxOut.txOutIndex;
    return txIn;
  };

  private findTxOutsForAmount(amount: number, myUnspentTxOuts: UnspentTxOut[]) {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
      includedUnspentTxOuts.push(myUnspentTxOut);
      currentAmount = currentAmount + myUnspentTxOut.amount;
      if (currentAmount >= amount) {
        const leftOverAmount = currentAmount - amount;
        return { includedUnspentTxOuts, leftOverAmount };
      }
    }

    const eMsg = 'Cannot create transaction from the available unspent transaction outputs.' +
      ' Required amount:' + amount + '. Available unspentTxOuts:' + JSON.stringify(myUnspentTxOuts);
    throw Error(eMsg);
  };

  private createTxOuts(receiverAddress: string, myAddress: string, amount: number, leftOverAmount: number) {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
      return [txOut1];
    } else {
      const leftOverTx = new TxOut(myAddress, leftOverAmount);
      return [txOut1, leftOverTx];
    }
  };

  private filterTxPoolTxs(unspentTxOuts: UnspentTxOut[], transactionPool: Transaction[]): UnspentTxOut[] {
    const txIns: TxIn[] = _.chain(transactionPool)
      .map((tx: Transaction) => tx.txIns)
      .flatten()
      .value();
    const removable: UnspentTxOut[] = [];
    for (const unspentTxOut of unspentTxOuts) {
      const txIn = _.find(txIns, (aTxIn: TxIn) => {
        return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
      });

      if (txIn === undefined) {

      } else {
        removable.push(unspentTxOut);
      }
    }

    return _.without(unspentTxOuts, ...removable);
  };
}
