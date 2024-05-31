import * as _ from 'lodash';
import { UnspentTxOut } from "../../../entities/transaction";
import TransactionService from '../../services/transactionService';
import { TransactionGateway } from '../transaction/interfaces/transactionGateway';
import WalletService from '../../services/walletService';

export default class GetWalletBalance {
  constructor(private transactionGateway: TransactionGateway) { };

  async execute(): Promise<number> {
    const myAddress = WalletService.getPublicFromWallet();
    const unspentTxOuts = await this.transactionGateway.getUnspentTxOuts();

    const aUnspentTxOuts = (TransactionService.findUnspentTxOuts(myAddress, unspentTxOuts))
      .map((uTxO: UnspentTxOut) => uTxO.amount);

    return _.sum(aUnspentTxOuts);
  }
}