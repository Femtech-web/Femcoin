import CryptoJS from 'crypto-js';
import * as ecdsa from 'elliptic';
import * as _ from 'lodash';

const ec = new ecdsa.ec('secp256k1');

export default class CryptoService {
  static getPublicKey(aPrivateKey: string): string {
    return ec.keyFromPrivate(aPrivateKey, 'hex').getPublic().encode('hex');
  };

  static getKey(aPrivateKey: string) {
    return ec.keyFromPrivate(aPrivateKey, 'hex');
  }

  static getFromPublic(address: string) {
    return ec.keyFromPublic(address, 'hex');
  }

  static hashContent(content: any) {
    return CryptoJS.SHA256(content)
  }
}