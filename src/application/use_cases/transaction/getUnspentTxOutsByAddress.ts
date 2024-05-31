import TransactionService from "../../services/transactionService";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";

export default class GetUnspentTxOutsByAddress {
  constructor(private transactionGateway: TransactionGateway) { }

  async execute(address: string) {
    const allUnpentTxOuts = await this.transactionGateway.getUnspentTxOuts();

    return TransactionService.findUnspentTxOuts(address, allUnpentTxOuts);
  };
} 
