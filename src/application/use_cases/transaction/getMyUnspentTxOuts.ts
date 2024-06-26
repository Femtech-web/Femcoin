import WalletService from "../../services/walletService";
import TransactionService from "../../services/transactionService";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";

export default class GetMyUnspentTxOuts {
  constructor(private transactionGateway: TransactionGateway) { }

  async execute() {
    const myAddress = WalletService.getPublicFromWallet();
    const allUnpentTxOuts = await this.transactionGateway.getUnspentTxOuts();

    return TransactionService.findUnspentTxOuts(myAddress, allUnpentTxOuts);
  };
} 
