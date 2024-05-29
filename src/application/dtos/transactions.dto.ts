import { IsArray } from "class-validator";
import Transaction from "../../entities/transaction";

export class TransactionsDto {
  @IsArray()
  public transactions!: Transaction[];
}