import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export default class UtilsService {
  constructor() { };

  static getCurrentTimestamp(): number {
    return Math.round(new Date().getTime() / 1000);
  }

  static hexToBinary(s: string): string | null {
    let ret: string = '';
    const lookupTable: Record<string, string> = {
      '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
      '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
      'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
      'e': '1110', 'f': '1111'
    };
    for (let i: number = 0; i < s.length; i = i + 1) {
      if (lookupTable[s[i]]) {
        ret += lookupTable[s[i]];
      } else {
        return null;
      }
    }
    return ret;
  };

  static toHexString(byteArray: string): string {
    return Array.from(byteArray, (byte: any) => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  };

  static JSONToObject<T>(data: string): T | null {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  static async validateDto(dto: any, reqObj: any) {
    try {
      const dtoInstance = plainToInstance(dto, reqObj);
      const errors: ValidationError[] = await validate(dtoInstance);

      if (errors.length > 0) {
        console.log(errors)
        const dtoErrors = errors.map((error: ValidationError) => {
          return (Object as any).values(error.constraints).join(", ")
        })

        const allErrors = dtoErrors.join(",")
        throw new Error(allErrors)
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  };


}