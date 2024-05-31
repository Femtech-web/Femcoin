import { IsString, Length } from "class-validator";

export class AddressDto {
  @IsString()
  @Length(5, 255)
  public address!: string;
}

export class NodeAddressDto {
  @IsString()
  @Length(5, 255)
  public address!: string;
}