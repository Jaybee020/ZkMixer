/* eslint-disable no-undef */
import { buildPoseidon } from "circomlibjs";
import { groth16 } from "snarkjs";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
const { providers, utils } = require("ethers");
const { RegistryClient } = require("./client");

function unstringifyBigInts(o) {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    if (o === null) return null;
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

function convert(F, value) {
  if (typeof value == "bigint") {
    return String(value);
  }
  return String(F.toObject(value));
}

export async function getProvider(networkUrl) {
  return new providers.JsonRpcProvider(networkUrl);
}

export async function getMixer() {
  const provider = await getProvider("https://api.s0.ps.hmny.io");
  const mixer = new Contract(
    "0x1F8eb6EEB139015a386d0fdb5ED5A604C643f7de",
    Mixer.abi,
    provider
  );

  return mixer;
}

export async function getSolidityCallData(mixer, secret, nullifier) {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;
  const hashes = await mixer.getHashes();
  const root = await mixer.getRoot();
  const commitment = F.toObject(poseidon([secret, nullifier]));
  let nullifierHash = F.toObject(poseidon([nullifier]));
  const tree = new IncrementalMerkleTree(poseidon, 3, BigInt(0), 2);
  const leafs = hashes.slice(0, 8); //tree depth is 3 so get leaf nodes
  leafs.forEach((leaf) => {
    tree.insert(BigInt(leaf));
  });
  const index = tree.indexOf(commitment);
  const inclusionProof = tree.createProof(index);
  const path_index = inclusionProof.pathIndices.map(String);
  const path_elements = inclusionProof.siblings.flat().map((sibling) => {
    return convert(F, sibling);
  });

  const Input = {
    nullifier: nullifier.toString(),
    secret: secret.toString(),
    path_elements: path_elements,
    path_index: path_index,
    root: String(root),
    nullifierHash: String(nullifierHash),
  };
  var { proof, publicSignals } = await groth16.fullProve(
    Input,
    "../../Withdraw.wasm",
    "../../circuit_final.zkey"
  );
  const editedPublicSignals = unstringifyBigInts(publicSignals);
  const editedProof = unstringifyBigInts(proof);
  const calldata = await groth16.exportSolidityCallData(
    editedProof,
    editedPublicSignals
  );
  const argv = calldata
    .replace(/["[\]\s]/g, "")
    .split(",")
    .map((x) => BigInt(x).toString());

  const a = [argv[0], argv[1]];
  const b = [
    [argv[2], argv[3]],
    [argv[4], argv[5]],
  ];
  const c = [argv[6], argv[7]];
  const input = argv.slice(8);
  return [a, b, c, input];
}

export async function encodeCallData(to, fee, a, b, c, input) {
  let ABI = [
    "function withdraw(address payable to,uint256 fee, uint[2] memory a,uint[2][2] memory b,uint[2] memory c,uint[2] memory input)",
  ];
  let iface = new utils.Interface(ABI);
  const callData = iface.encodeFunctionData("withdraw", [
    to,
    fee,
    a,
    b,
    c,
    input,
  ]);
  return callData;
}

export async function getRelayers(n = 1) {
  const provider = await getProvider("https://api.s0.ps.hmny.io");
  const client = new RegistryClient(provider);
  const relayersAddrs = await client.getRelayers(n);
  const relayersData = Promise.all(
    relayersAddrs.map(async (relayerAddr) => {
      const { count, sum } = await client.getRelayerFee(relayerAddr);
      const locator = await client.getRelayerLocator(relayerAddr);
      return {
        addr: relayerAddr,
        count: count.toNumber(),
        sum: sum.toNumber(),
        locator: locator,
      };
    })
  );
  return relayersData;
}

export async function submitTx(relayerLocator, txn) {
  const provider = await getProvider("https://api.s0.ps.hmny.io");
  const client = new RegistryClient(provider);
  const result = await client.submitTx(relayerLocator, txn);
  return result;
}
