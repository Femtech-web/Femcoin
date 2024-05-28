import Transaction from "../../../entities/transaction";
import ValidateTransaction from "../transaction/validateTransaction";
import CreateTransaction from "../wallet/createTransaction";
import GetCoinbaseTx from "../transaction/getCoinbaseTransaction";
import WalletService from "../../services/walletService";
import { BlockGateway } from "../blockchain/interfaces/blockGateway";
import { TransactionGateway } from '../transaction/interfaces/transactionGateway';
import GenerateRawBlock from './generateRawNextBlock';

export default class generateNextBlockWithTransaction {
  constructor(
    private blockGateway: BlockGateway,
    private transactionGateway: TransactionGateway,
    private generateRawNextBlock: GenerateRawBlock,
  ) { }

  async execute(receiverAddress: string, amount: number) {
    if (!ValidateTransaction.isValidAddress(receiverAddress)) {
      throw Error('invalid address');
    }
    if (typeof amount !== 'number') {
      throw Error('invalid amount');
    };
    const address = WalletService.getPublicFromWallet();
    const latestBlock = (await this.blockGateway.getLastBlock()).index + 1;

    const privateKey = WalletService.getPrivateFromWallet();
    const aUnspentTxOuts = await this.transactionGateway.getUnspentTxOuts();
    const transactionPool = await this.transactionGateway.getTransactionPool();

    const coinbaseTx: Transaction = GetCoinbaseTx.execute(address, latestBlock);
    const tx: Transaction = CreateTransaction.execute(receiverAddress, amount, privateKey, aUnspentTxOuts, transactionPool);
    const blockData: Transaction[] = [coinbaseTx, tx];
    return this.generateRawNextBlock.execute(blockData);
  };
}