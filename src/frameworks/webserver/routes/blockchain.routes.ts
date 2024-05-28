import Express from 'express'
import BlockchainController from '../../../adapters/controllers/blockchain.controller'
import Block from "../../../entities/block";
import AddBlock from "../../../application/use_cases/blockchain/replaceChain";
import { BlockGatewayImpl } from "../../../adapters/gateways/blockGatewayImpl";

export default function blockchainRouter(express: typeof Express, blockchain: Block[]) {
  const router = express.Router();

  const blockGateway = new BlockGatewayImpl(blockchain);
  const addBlock = new AddBlock(blockGateway);

  // load controller with dependencies
  const controller = new BlockchainController(addBlock);


  // POST endpoint
  // router.route('/')
  //   .post(
  //     [
  //       requirePasswordExists,
  //       requireEmailExists
  //     ], validatorErrorHandler, controller.loginUser);

  return router;
}
