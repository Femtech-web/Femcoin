import Transaction from "../../../entities/transaction";
import AddToTransactionPool from "../transactionPool/addToTransactionPool";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";

export default class handleReceivedTx {
  constructor(
    private transactionGateway: TransactionGateway,
    private addToTxPool: AddToTransactionPool
  ) { }
  async execute(transaction: Transaction) {
    const allUnspentTxOuts = await this.transactionGateway.getUnspentTxOuts();

    this.addToTxPool.execute(transaction, allUnspentTxOuts);
  }
};