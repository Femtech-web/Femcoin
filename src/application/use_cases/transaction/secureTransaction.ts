import Transaction, { TxIn, TxOut, UnspentTxOut } from '../../../entities/transaction';
import TransactionService from '../../services/transactionService';
import CryptoService from '../../services/cryptoServices';
import UtilsService from '../../../utils';

export default class SecureTransaction {
  static getTransactionId(transaction: Transaction): string {
    const txInContent: string = transaction.txIns
      .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
      .reduce((a, b) => a + b, '');

    const txOutContent: string = transaction.txOuts
      .map((txOut: TxOut) => txOut.address + txOut.amount)
      .reduce((a, b) => a + b, '');

    return CryptoJS.SHA256(txInContent + txOutContent).toString();
  };

  static signTxIn(transaction: Transaction, txInIndex: number,
    privateKey: string, aUnspentTxOuts: UnspentTxOut[]): string {
    const txIn: TxIn = transaction.txIns[txInIndex];

    const dataToSign = transaction.id;
    const referencedUnspentTxOut: UnspentTxOut = TransactionService.findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);
    if (referencedUnspentTxOut == null) {
      console.log('could not find referenced txOut');
      throw Error();
    }
    const referencedAddress = referencedUnspentTxOut.address;

    if (CryptoService.getPublicKey(privateKey) !== referencedAddress) {
      console.log('trying to sign an input with private' +
        ' key that does not match the address that is referenced in txIn');
      throw Error();
    }
    const key = CryptoService.getKey(privateKey);
    const signature: string = UtilsService.toHexString(key.sign(dataToSign).toDER());

    return signature;
  };

}