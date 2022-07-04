# Zero-Knowledge Mixer

A platform that allows users to deposit tokens into a smart contract and anonymously withdraw these tokens. This platform utilizes the [relayer network](https://github.com/Jaybee020/zkRelayer) system to submit transaction for the withdrawal purposes.

**NOTE**. The merkle tree in this contract was initialized with just 256 leaves for testing purposes. For testing purposes the circom file and mixer should be set to 3 leaves.

# Install Dependencies

```http
  npm install
```

# Project Structure

This project is made up of 3 main folders

- circuit
- contracts
- frontend

## Circuit

The circuit folder contains the circuits used in the mixer. The circuits generate a merkle inclusion proof in order to process withdrawals.

To compile the circuit

- Run `bash scripts/compile.sh`. This also generates the Verifier.sol file

## Contracts

This folder contains all contracts used for the mixer. The Verifer.sol was generated using snark js. The Mixer contract extends both the Verifier and Merkle contracts.

### Run Tests

To run contracts test

```
  npx hardhat tests
```

## Frontend

This contains the UI of the project.It was written in react. To start the server

Cd into the directory

```
  cd frontend
```

Start Server

```
  npm start
```
