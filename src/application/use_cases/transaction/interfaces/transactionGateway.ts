import Transaction from "../../../../entities/transaction";
import { UnspentTxOut } from "../../../../entities/transaction";

export interface TransactionGateway {
  getUnspentTxOuts(): Promise<UnspentTxOut[]>;
  getTransactionPool(): Promise<Transaction[]>;
  setUnspentTxOuts(newUnspentTxOut: UnspentTxOut[]): Promise<void>;
  setTransactionPool(newTransactionPool: Transaction[]): Promise<void>;
  addToTransactionPool(newTransaction: Transaction): Promise<void>;
}
