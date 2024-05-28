import { TransactionGatewayImpl as TransactionGateway } from "../../../adapters/gateways/transactionGatewayImpl";
import Transaction from "../../../entities/transaction";
import { UnspentTxOut } from "../../../entities/transaction";

export default class UpdateUnspentTxOuts {
  constructor() { }

  public static execute(aTransactions: Transaction[], aUnspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
    const classInstance = new UpdateUnspentTxOuts();

    const newUnspentTxOuts = classInstance.createNewUnspentTxOuts(aTransactions);
    const consumedTxOuts = classInstance.createConsumedTxOuts(aTransactions);
    return classInstance.filterAndCombineUnspentTxOuts(aUnspentTxOuts, newUnspentTxOuts, consumedTxOuts);
  }

  private createNewUnspentTxOuts(aTransactions: Transaction[]): UnspentTxOut[] {
    return aTransactions
      .map((t) => {
        return t.txOuts.map((txOut, index) => new UnspentTxOut(t.id, index, txOut.address, txOut.amount));
      })
      .reduce((a, b) => a.concat(b), []);
  }

  private createConsumedTxOuts(aTransactions: Transaction[]): UnspentTxOut[] {
    return aTransactions
      .map((t) => t.txIns)
      .reduce((a, b) => a.concat(b), [])
      .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));
  }

  private filterAndCombineUnspentTxOuts(
    aUnspentTxOuts: UnspentTxOut[],
    newUnspentTxOuts: UnspentTxOut[],
    consumedTxOuts: UnspentTxOut[]
  ): UnspentTxOut[] {
    return aUnspentTxOuts
      .filter((uTxO) => !this.findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts))
      .concat(newUnspentTxOuts);
  }

  private findUnspentTxOut(txOutId: string, txOutIndex: number, consumedTxOuts: UnspentTxOut[]): boolean {
    return consumedTxOuts.some(
      (uTxO) => uTxO.txOutId === txOutId && uTxO.txOutIndex === txOutIndex
    );
  }
}
