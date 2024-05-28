import { Transaction } from "./transaction.interface";

export interface BlockInterface {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: Transaction[];
  difficulty: number;
  nonce: number;
}