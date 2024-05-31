import { IsString } from "class-validator";

export class HashDto {
  @IsString()
  public hash!: string;
}

export class IdDto {
  @IsString()
  public id!: string;
}