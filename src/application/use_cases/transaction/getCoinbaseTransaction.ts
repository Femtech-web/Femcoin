import Transaction from "../../../entities/transaction";
import { TxIn, TxOut } from "../../../entities/transaction";
import { COINBASE_AMOUNT } from "../../constants/transaction.const";
import SecureTransaction from "./secureTransaction";

export default class GetCoinbaseTransaction {
  public static execute(address: string, blockIndex: number): Transaction {
    const t = new Transaction();
    const txIn: TxIn = new TxIn();
    txIn.signature = '';
    txIn.txOutId = '';
    txIn.txOutIndex = blockIndex;

    t.txIns = [txIn];
    t.txOuts = [new TxOut(address, COINBASE_AMOUNT)];
    t.id = SecureTransaction.getTransactionId(t);
    return t;
  };
}