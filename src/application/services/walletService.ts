// import * as CryptoJS from 'crypto-js';
import * as ecdsa from 'elliptic';
import * as _ from 'lodash';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import CryptoService from './cryptoServices';

const ec = new ecdsa.ec('secp256k1');
const privateKeyLocation = 'wallet/keys/private_key';

export default class WalletService {
  constructor() { }

  public static initWallet() {
    if (existsSync(privateKeyLocation)) {
      return;
    }
    const newPrivateKey = new WalletService().generatePrivateKey();

    writeFileSync(privateKeyLocation, newPrivateKey);
    console.log('new wallet with private key created to : %s', privateKeyLocation);
  };

  static getPrivateFromWallet(): string {
    const buffer = readFileSync(privateKeyLocation, 'utf8');
    return buffer.toString();
  };

  static getPublicFromWallet(): string {
    const privateKey = this.getPrivateFromWallet();
    const key = CryptoService.getKey(privateKey);
    return key.getPublic().encode('hex');
  };

  private generatePrivateKey(): string {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
  };
}