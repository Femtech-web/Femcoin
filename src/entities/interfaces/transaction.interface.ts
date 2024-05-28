interface TxIn {
  txOutId: string;
  txOutIndex: number;
  signature: string;
}

interface TxOut {
  address: string;
  amount: number;
}

export interface Transaction {
  id: string;

  txIns: TxIn[];
  txOuts: TxOut[];
}