import { TransactionGateway } from "../transaction/interfaces/transactionGateway";

export default class GetTransactionPool {
  constructor(private transactionGateway: TransactionGateway) { }

  async execute() {
    const allTransactionPool = await this.transactionGateway.getTransactionPool();

    return allTransactionPool;
  };
} 
