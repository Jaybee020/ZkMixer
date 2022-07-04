import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
const buildPoseidon = require("circomlibjs").buildPoseidon;
const { poseidonContract } = require("circomlibjs");

async function deployMixer() {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;
  const PoseidonT3 = await ethers.getContractFactory(
    poseidonContract.generateABI(2),
    poseidonContract.createCode(2)
  );
  const poseidonT3 = await PoseidonT3.deploy();
  await poseidonT3.deployed();

  const Mixer = await ethers.getContractFactory("Mixer", {
    libraries: {
      PoseidonT3: poseidonT3.address,
    },
  });
  const mixer = await Mixer.deploy(8);
  await mixer.deployed();
  return mixer;
}

(async function run() {
  const mixer = await deployMixer();
  console.log("Mixer contract has been deployed to " + mixer.address);
})();
