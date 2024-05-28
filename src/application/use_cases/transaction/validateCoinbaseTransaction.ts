import Transaction from "../../../entities/transaction";
import { COINBASE_AMOUNT } from "../../constants/transaction.const";
import SecureTransaction from "./secureTransaction";

export default class ValidateCoinbaseTransaction {
  constructor() { }
  public static execute(transaction: Transaction, blockIndex: number): boolean {
    if (transaction == null) {
      console.log('the first transaction in the block must be coinbase transaction');
      return false;
    }
    if (SecureTransaction.getTransactionId(transaction) !== transaction.id) {
      console.log('invalid coinbase tx id: ' + transaction.id);
      return false;
    }
    if (transaction.txIns.length !== 1) {
      console.log('one txIn must be specified in the coinbase transaction');
      return false;
    }
    if (transaction.txIns[0].txOutIndex !== blockIndex) {
      console.log('the txIn signature in coinbase tx must be the block height');
      return false;
    }
    if (transaction.txOuts.length !== 1) {
      console.log('invalid number of txOuts in coinbase transaction');
      return false;
    }
    if (transaction.txOuts[0].amount !== COINBASE_AMOUNT) {
      console.log('invalid coinbase amount in coinbase transaction');
      return false;
    }
    return true;
  };

}