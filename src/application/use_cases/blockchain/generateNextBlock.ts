import Transaction from "../../../entities/transaction";
import GetCoinbaseTx from "../transaction/getCoinbaseTransaction";
import WalletService from "../../services/walletService";
import { BlockGateway } from "./interfaces/blockGateway";
import { TransactionGateway } from "../transaction/interfaces/transactionGateway";
import GenerateRawBlock from './generateRawNextBlock';

export default class GenerateNextBlock {
  constructor(
    private blockGateway: BlockGateway,
    private transactionGateway: TransactionGateway,
    private generateRawNextBlock: GenerateRawBlock,
  ) { }

  async execute() {
    const address = WalletService.getPublicFromWallet();
    const latestBlock = (await this.blockGateway.getLastBlock()).index + 1;
    const transactionPool = await this.transactionGateway.getTransactionPool()

    const coinbaseTx: Transaction = GetCoinbaseTx.execute(address, latestBlock);
    const blockData: Transaction[] = [coinbaseTx].concat(transactionPool);
    return await this.generateRawNextBlock.execute(blockData);
  };
}