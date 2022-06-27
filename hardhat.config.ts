import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = String(process.env.PRIVATE_KEY);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    testnet: {
      url: `https://api.s0.ps.hmny.io`, //link for rpcUrl of devnet
      accounts: [
        PRIVATE_KEY, //input your private key
      ],
    },
  },
};
