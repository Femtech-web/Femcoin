import { Request, Response, NextFunction } from "express";
import UtilsService from "../../utils";

import { HashDto, TransactionsDto, ValueOutputDto } from "../../application/dtos";

import GetBlockchain from "../../application/use_cases/blockchain/getBlockchain";
import GetBlockByHash from "../../application/use_cases/blockchain/getByHash";
import GenerateRawNextBlock from "../../application/use_cases/blockchain/generateRawNextBlock";
import GenerateNextBlock from "../../application/use_cases/blockchain/generateNextBlock";
import GenerateNextBlockWithTransactions from "../../application/use_cases/blockchain/generateNextBlockWithTransactions";

export default class BlockchainController {
  constructor(
    private getAllBlocks: GetBlockchain,
    private getBlockWithHash: GetBlockByHash,
    private generateNextRawBlock: GenerateRawNextBlock,
    private generateNextBlock: GenerateNextBlock,
    private generateNextBlockWithTransactions: GenerateNextBlockWithTransactions,
  ) { }

  async getBlockchain(req: Request, res: Response, next: NextFunction) {
    try {
      const blockchain = await this.getAllBlocks.execute();

      return res.status(200).json(blockchain);
    } catch (error) {
      return next(error)
    }
  };

  async getSingleBlock(req: Request, res: Response, next: NextFunction) {
    try {
      await UtilsService.validateDto(HashDto, req.params);
      const hashValue = req.params.hash.toString();

      const blockWithHash = await this.getBlockWithHash.execute(hashValue);
      return res.status(200).json(blockWithHash);
    } catch (error) {
      return next(error)
    }
  };

  async mineRawBlock(req: Request, res: Response, next: NextFunction) {
    try {
      await UtilsService.validateDto(TransactionsDto, req.body);
      const newBlock = await this.generateNextRawBlock.execute(req.body);

      if (newBlock === null) {
        return res.status(400).json({ message: 'could not generate block' });
      } else {
        return res.status(201).json(newBlock);
      }
    } catch (error) {
      return next(error)
    }
  };

  async mineBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const newBlock = await this.generateNextBlock.execute();

      if (newBlock === null) {
        return res.status(400).json({ message: 'could not generate block' });
      } else {
        return res.status(201).json({ newBlock });
      }
    } catch (error) {
      return next(error)
    }
  };

  async mineWithTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { address, amount: stringAmount } = req.body;
      console.log(req.body)
      const amount = parseInt(stringAmount)
      const value = { address, amount }
      await UtilsService.validateDto(ValueOutputDto, value);

      const newBlock = await this.generateNextBlockWithTransactions.execute(address, amount);
      if (newBlock === null) {
        return res.status(400).json({ message: 'could not generate block' });
      } else {
        return res.status(201).json(newBlock);
      }
    } catch (error) {
      return next(error)
    }
  }
}
