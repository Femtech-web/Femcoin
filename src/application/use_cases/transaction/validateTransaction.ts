import Transaction from "../../../entities/transaction";
import { TxIn, TxOut, UnspentTxOut } from "../../../entities/transaction";
import CryptoService from "../../services/cryptoServices";
import TransactionService from "../../services/transactionService";
import SecureTransaction from "./secureTransaction";

export default class ValidateTransaction {
  constructor() { }

  public static execute(transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    const validator = new ValidateTransaction();
    if (!validator.isValidTransactionStructure(transaction)) {
      return false;
    }

    if (SecureTransaction.getTransactionId(transaction) !== transaction.id) {
      console.log('invalid tx id: ' + transaction.id);
      return false;
    }
    const hasValidTxIns: boolean = transaction.txIns
      .map((txIn) => validator.validateTxIn(txIn, transaction, aUnspentTxOuts))
      .reduce((a, b) => a && b, true);

    if (!hasValidTxIns) {
      console.log('some of the txIns are invalid in tx: ' + transaction.id);
      return false;
    }

    const totalTxInValues: number = transaction.txIns
      .map((txIn) => validator.getTxInAmount(txIn, aUnspentTxOuts))
      .reduce((a, b) => (a + b), 0);

    const totalTxOutValues: number = transaction.txOuts
      .map((txOut) => txOut.amount)
      .reduce((a, b) => (a + b), 0);

    if (totalTxOutValues !== totalTxInValues) {
      console.log('totalTxOutValues !== totalTxInValues in tx: ' + transaction.id);
      return false;
    }

    return true;
  };

  private validateTxIn(txIn: TxIn, transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
    const referencedUTxOut: UnspentTxOut = TransactionService.findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);
    if (!referencedUTxOut || referencedUTxOut === null) {
      throw new Error('referencedUTxOut not found')
    }
    if (referencedUTxOut == null) {
      console.log('referenced txOut not found: ' + JSON.stringify(txIn));
      return false;
    }
    const address = referencedUTxOut.address;

    const key = CryptoService.getFromPublic(address);
    const validSignature: boolean = key.verify(transaction.id, txIn.signature);
    if (!validSignature) {
      console.log('invalid txIn signature: %s txId: %s address: %s', txIn.signature, transaction.id, referencedUTxOut.address);
      return false;
    }
    return true;
  };

  private getTxInAmount(txIn: TxIn, aUnspentTxOuts: UnspentTxOut[]): number {
    return TransactionService.findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts).amount;
  };

  private isValidTransactionStructure(transaction: Transaction) {
    if (typeof transaction.id !== 'string') {
      console.log('transactionId missing');
      return false;
    }
    if (!(transaction.txIns instanceof Array)) {
      console.log('invalid txIns type in transaction');
      return false;
    }
    if (!transaction.txIns
      .map(this.isValidTxInStructure)
      .reduce((a, b) => (a && b), true)) {
      return false;
    }

    if (!(transaction.txOuts instanceof Array)) {
      console.log('invalid txIns type in transaction');
      return false;
    }

    if (!transaction.txOuts
      .map(this.isValidTxOutStructure)
      .reduce((a, b) => (a && b), true)) {
      return false;
    }
    return true;
  };

  private isValidTxOutStructure(txOut: TxOut): boolean {
    if (txOut == null) {
      console.log('txOut is null');
      return false;
    } else if (typeof txOut.address !== 'string') {
      console.log('invalid address type in txOut');
      return false;
    } else if (!ValidateTransaction.isValidAddress(txOut.address)) {
      console.log('invalid TxOut address');
      return false;
    } else if (typeof txOut.amount !== 'number') {
      console.log('invalid amount type in txOut');
      return false;
    } else {
      return true;
    }
  };

  private isValidTxInStructure(txIn: TxIn): boolean {
    if (txIn == null) {
      console.log('txIn is null');
      return false;
    } else if (typeof txIn.signature !== 'string') {
      console.log('invalid signature type in txIn');
      return false;
    } else if (typeof txIn.txOutId !== 'string') {
      console.log('invalid txOutId type in txIn');
      return false;
    } else if (typeof txIn.txOutIndex !== 'number') {
      console.log('invalid txOutIndex type in txIn');
      return false;
    } else {
      return true;
    }
  };

  public static isValidAddress(address: string): boolean {
    if (address.length !== 130) {
      console.log(address);
      console.log('invalid public key length');
      return false;
    } else if (address.match('^[a-fA-F0-9]+$') === null) {
      console.log('public key must contain only hex characters');
      return false;
    } else if (!address.startsWith('04')) {
      console.log('public key must start with 04');
      return false;
    }
    return true;
  };

}