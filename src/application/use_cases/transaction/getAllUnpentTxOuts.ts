import { TransactionGateway } from "../transaction/interfaces/transactionGateway";

export default class GetAllUnspentTxOuts {
  constructor(private transactionGateway: TransactionGateway) { }

  async execute() {
    const allUnpentTxOuts = await this.transactionGateway.getUnspentTxOuts();
    return allUnpentTxOuts;
  };
} 
