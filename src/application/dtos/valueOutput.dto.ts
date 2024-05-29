import { IsString, IsNumber } from "class-validator";
import { TxOut } from "../../entities/transaction";

export class ValueOutputDto {
  @IsString()
  public address!: TxOut['address'];

  @IsNumber()
  public amount!: TxOut['amount'];
}