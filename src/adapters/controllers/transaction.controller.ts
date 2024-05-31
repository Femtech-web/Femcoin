import { Request, Response, NextFunction } from "express";
import UtilsService from "../../utils";
import { IdDto, AddressDto, ValueOutputDto } from "../../application/dtos";

import GetTransactionById from "../../application/use_cases/transaction/getById";
import GetMyUnspentTxOuts from "../../application/use_cases/transaction/getMyUnspentTxOuts";
import GetAllUnspentTxOuts from "../../application/use_cases/transaction/getAllUnpentTxOuts";
import SendTransaction from "../../application/use_cases/transaction/sendTransaction";
import GetTransactionPool from "../../application/use_cases/transactionPool/getTransactionPool";
import GetUnspentTxOutsByAddress from "../../application/use_cases/transaction/getUnspentTxOutsByAddress";

export default class TransactionController {
  constructor(
    private getTransactionById: GetTransactionById,
    private getMineUnspentTxOuts: GetMyUnspentTxOuts,
    private getAllUnspentTxOuts: GetAllUnspentTxOuts,
    private sendTransaction: SendTransaction,
    private getAllTransactions: GetTransactionPool,
    private getUnspentTxOutsByAddress: GetUnspentTxOutsByAddress
  ) { }

  async getSingleTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(IdDto, req.params);
      const transactionId = req.params.id.toString()

      const transaction = await this.getTransactionById.execute(transactionId);
      res.status(200).json({ transaction });
    } catch (error) {
      return next(error)
    }
  };

  async getSingleNodeUnspentTxOuts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(AddressDto, req.params);
      const publicAddress = req.params.address.toString()

      const myUnspentTxOuts = await this.getUnspentTxOutsByAddress.execute(publicAddress);
      res.status(200).json({ myUnspentTxOuts });
    } catch (error) {
      return next(error)
    }
  };

  async getMyUnspentTxOuts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const myUnspentTxOuts = await this.getMineUnspentTxOuts.execute();
      res.status(200).json(myUnspentTxOuts);
    } catch (error) {
      return next(error)
    }
  };

  async getUnspentTxOuts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allUnspentTxOuts = await this.getAllUnspentTxOuts.execute();
      res.status(200).json({ allUnspentTxOuts });
    } catch (error) {
      return next(error)
    }
  };

  async getTransactionPool(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transactionPool = await this.getAllTransactions.execute();

      res.status(200).json({ allTransactions: transactionPool });
    } catch (error) {
      return next(error)
    }
  };

  async makeTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(ValueOutputDto, req.body);

      const address = req.body.address.toString();
      const amount = req.body.amount;

      const transaction = await this.sendTransaction.execute(address, amount);
      res.status(200).json({ message: 'transaction successful', transaction });
    } catch (error) {
      return next(error)
    }
  };
}
