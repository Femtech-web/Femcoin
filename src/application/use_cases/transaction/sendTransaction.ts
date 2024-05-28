import Transaction from "../../../entities/transaction";
import WalletService from "../../services/walletService";
import CreateTransaction from "./createTransaction";
import AddToTransactionPool from "../transactionPool/addToTransactionPool";
import { TransactionGateway } from "./interfaces/transactionGateway";

export default class SendTransaction {
  constructor(
    private transactionGateway: TransactionGateway,
    private addToTransactionPool: AddToTransactionPool,
  ) { }

  async execute(address: string, amount: number): Promise<Transaction> {
    const allUnpentTxOuts = await this.transactionGateway.getUnspentTxOuts();
    const transactionPool = await this.transactionGateway.getTransactionPool();
    const privateKey = WalletService.getPrivateFromWallet();

    const tx: Transaction = CreateTransaction.execute(address, amount, privateKey, allUnpentTxOuts, transactionPool);
    this.addToTransactionPool.execute(tx, allUnpentTxOuts);
    // broadCastTransactionPool();
    return tx;
  };
}