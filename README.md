# Femcoin

# A Cryptocurrency within a peer to peer system

This cryptocurrency project is built using TypeScript and Node.js. It provides a robust platform for blockchain interactions, including creating and managing wallets, performing transactions, mining blocks, and maintaining a peer-to-peer network. The project follows a modular architecture with a clear separation of concerns, making it scalable and maintainable.

### API Endpoints

#### Blockchain Endpoints

1. **Get All Blocks**

   - `GET /api/blockchain`

2. **Get Block By Hash**

   - `GET /api/blockchain/:hash`

3. **Mine Raw Block**

   - `POST /api/blockchain/mineRawBlock`

4. **Mine Block**

   - `POST /api/blockchain/mineBlock`

5. **Mine Block With Transactions**
   - `POST /api/blockchain/mineTransaction`

#### Transaction Endpoints

1. **Get Transaction Pool**

   - `GET /api/transactions`

2. **Get Transaction By ID**

   - `GET /api/transactions/:id`

3. **Get Unspent Transactions By Address**

   - `GET /api/transactions/unspentTxOuts/:address`

4. **Get My Unspent Transactions**

   - `GET /api/transactions/myUnspentTxOuts`

5. **Make Transaction**
   - `POST /api/transactions`

#### Wallet Endpoints

1. **Get Wallet Balance**

   - `GET /api/wallet/balance`

2. **Get Wallet Address**
   - `GET /api/wallet/address`

#### P2P Communication Endpoints

1. **Get All Peers**

   - `GET /api/p2p/peers`

2. **Connect To Peers**
   - `POST /api/p2p/join`

## Project Domain Design

### Domain Entities

1. **Block**

   - Represents a single block in the blockchain, containing transactions, an index, a timestamp, a difficulty level, a nounce, a hash and a previoushash linking it to the previous block.

2. **Transaction**

   - Represents a cryptocurrency transaction, detailing the transfer of funds from one address to another.

3. **Unspent Transaction Output (UTXO)**
   - Represents the unspent output of a transaction, which can be used as an input for new transactions.

### Core Use Cases

1. **Blockchain Management**

   - **GetAllBlocks**: Retrieves the complete blockchain.
   - **GetBlockByHash**: Fetches a specific block using its hash.
   - **GenerateNextRawBlock**: Mines a new raw block.
   - **GenerateNextBlock**: Mines a new block with transactions.
   - **GenerateNextBlockWithTransactions**: Mines a new block containing specific transactions.

2. **Transaction Management**

   - **GetTransactionById**: Retrieves a specific transaction using its ID.
   - **GetMyUnspentTxOuts**: Fetches all unspent transaction outputs for the current user.
   - **GetAllUnspentTxOuts**: Retrieves all unspent transaction outputs in the system.
   - **SendTransaction**: Creates and sends a new transaction.
   - **GetTransactionPool**: Retrieves the current transaction pool.

3. **Wallet Management**

   - **GetWalletBalance**: Gets the balance of the current user's wallet.
   - **GetWalletAddress**: Retrieves the address of the current user's wallet.

4. **P2P Communication**
   - **GetSockets**: Retrieves all connected peers.
   - **ConnectToPeers**: Connects to new peers in the network.

### Modular Architecture

1. **Controllers**

   - Manage the HTTP requests and responses, invoking the appropriate use cases to fulfill client requests.

2. **Use Cases**

   - Contain the core business logic, handling various operations related to blockchain, transactions, wallets, and peer-to-peer communication.

3. **Gateways**

   - Interface with the underlying data structures and storage, providing necessary data to the use cases.

4. **Entities**

   - Represent the core objects within the domain, such as blocks, transactions, and UTXOs.

5. **Framework**

- Includes the main application framework (Express.js) and WebSocket setup for handling HTTP requests and real-time communication.

6. **Utils**

- Utility functions and helpers that support various operations across the project.

### Peer-to-Peer Network

The project includes a peer-to-peer network component that allows nodes to communicate with each other, share blockchain updates, and maintain network consensus. This is achieved through WebSocket connections, enabling real-time data exchange and synchronization.

### Security and Integrity

The project ensures the security and integrity of the blockchain through cryptographic hashing and a proof-of-work consensus mechanism. Transactions are signed using private keys, and only valid transactions are added to the blockchain.
