import { Request, Response, NextFunction } from "express";
import WalletService from "../../application/services/walletService";

import GetWalletBalance from "../../application/use_cases/wallet/getBalance";

export default class WalletController {
  constructor(
    private getBalance: GetWalletBalance,
  ) { }

  async getAccountBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const balance = await this.getBalance.execute();

      res.status(200).json({ walletBalance: balance });
    } catch (error) {
      return next(error)
    }
  };

  async getWalletAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = WalletService.getPublicFromWallet();

      res.status(200).json({ address });
    } catch (error) {
      return next(error)
    }
  };

}
