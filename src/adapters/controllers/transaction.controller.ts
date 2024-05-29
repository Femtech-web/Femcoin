import { Request, Response, NextFunction } from "express";
import UtilsService from "../../utils";
import { IdDto } from "../../application/dtos";

import GetTransactionById from "../../application/use_cases/transaction/getById";

export default class TransactionController {
  constructor(
    private getTransactionById: GetTransactionById,
  ) { }

  async getSingleTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(IdDto, req.params);
      const transactionId = req.params.id.toString()

      const transaction = await this.getTransactionById.execute(transactionId);
      res.status(200).json(transaction);
    } catch (error) {
      return next(error)
    }
  }
}
