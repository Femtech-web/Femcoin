import { Request, Response } from "express";
import AddBlock from "../../application/use_cases/blockchain/replaceChain";
// import { GetBlockchain } from "../../use-cases/GetBlockchain";

export default class BlockchainController {
  constructor(
    private addBlock: AddBlock,
    // private getBlockchain: GetBlockchain
  ) { }

  // async addBlock(req: Request, res: Response): Promise<void> {
  //   const { data } = req.body;
  //   const newBlock = await this.addBlock.execute(data);
  //   res.status(201).json(newBlock);
  // }

  // async getBlockchain(req: Request, res: Response): Promise<void> {
  //   const blockchain = await this.getBlockchain.execute();
  //   res.json(blockchain);
  // }
}
