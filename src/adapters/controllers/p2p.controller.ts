import { Request, Response, NextFunction } from "express";
import UtilsService from "../../utils";
import { NodeAddressDto } from "../../application/dtos";

import GetSockets from "../../application/use_cases/p2pCommunication.ts/getSockets";
import ConnectToPeers from "../../application/use_cases/p2pCommunication.ts/connectToPeers";

export default class P2pController {
  constructor(
    private getSockets: GetSockets,
    private connectToPeers: ConnectToPeers
  ) { }

  async getAllPeers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const peers = await this.getSockets.execute();

      res.status(200).json({ allNodes: peers });
    } catch (error) {
      return next(error)
    }
  };

  async joinPeers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UtilsService.validateDto(NodeAddressDto, req.body);

      const address = req.body.address.toString();
      await this.connectToPeers.execute(address);

      res.status(201).json({ message: 'node joined successfully' });
    } catch (error) {
      return next(error)
    }
  };
}
