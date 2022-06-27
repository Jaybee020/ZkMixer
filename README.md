# Zero-Knowledge Mixer

A platform that allows users to deposit tokens into a smart contract and anonymously withdraw these tokens.

**NOTE**. The merkle tree in this contract was initialized with just 8 leaves for testing purposes.

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

## Frontend

This contains the UI of the project.It was written in react. To start the server

Cd into the directory

```http
  cd frontend
```

Start Server

```http
  npm start
```

## Run Tests

To run contracts test

```http
  npx hardhat tests
```
