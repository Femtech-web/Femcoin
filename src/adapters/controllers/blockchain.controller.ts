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

  async getBlockchain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blockchain = await this.getAllBlocks.execute();
      res.status(200).json(blockchain);
    } catch (error) {
      next(error)
    }
  };

  async getSingleBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(HashDto, req.params);
      const hashValue = req.params.hash.toString();

      const blockWithHash = await this.getBlockWithHash.execute(hashValue);
      res.status(200).json(blockWithHash);
    } catch (error) {
      next(error)
    }
  };

  async mineRawBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(TransactionsDto, req.body);

      const newBlock = await this.generateNextRawBlock.execute(req.body);
      if (newBlock === null) {
        res.status(400).json({ message: 'could not generate block' });
      } else {
        res.json(201).json(newBlock);
      }
    } catch (error) {
      next(error)
    }
  };

  async mineBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newBlock = await this.generateNextBlock.execute();
      if (newBlock === null) {
        res.status(400).json({ message: 'could not generate block' });
      } else {
        res.json(201).json(newBlock);
      }
    } catch (error) {
      next(error)
    }
  };

  async mineWithTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(ValueOutputDto, req.body);
      const { address, amount } = req.body;

      const newBlock = await this.generateNextBlockWithTransactions.execute(address, amount);
      if (newBlock === null) {
        res.status(400).json({ message: 'could not generate block' });
      } else {
        res.json(201).json(newBlock);
      }
    } catch (error) {
      next(error)
    }
  }
}
