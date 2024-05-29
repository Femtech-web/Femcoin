import { IsString, Length, Matches } from "class-validator";
import { HASH_REGEX } from "../constants/regex.const";

export class HashDto {
  @IsString()
  @Length(64, 64)
  @Matches(HASH_REGEX)
  public hash!: string;
}

export class IdDto {
  @IsString()
  @Length(64, 64)
  @Matches(HASH_REGEX)
  public id!: string;
}