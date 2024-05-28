import * as _ from 'lodash';
import { UnspentTxOut } from "../../../entities/transaction";
import TransactionService from '../../services/transactionService';

export default class getWalletBalance {
  execute(address: string, unspentTxOuts: UnspentTxOut[]): number {
    const aUnspentTxOuts = (TransactionService.findUnspentTxOuts(address, unspentTxOuts))
      .map((uTxO: UnspentTxOut) => uTxO.amount);

    return _.sum(aUnspentTxOuts);
  }
}