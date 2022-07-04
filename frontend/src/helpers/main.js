import { buildPoseidon } from "circomlibjs";
const { Contract, providers, utils } = require("ethers");
const Mixer = require("./Mixer.json");
const { getSolidityCallData, encodeCallData, submitTx } = require("./helpers");

function getEth() {
  //@ts-ignore
  const eth = window.ethereum; //ethereum object is added to your window by metamask
  if (!eth) {
    throw new Error("Could not find metamask");
  }
  return eth;
}

//accounts that are in metamask
async function hasAccounts() {
  const eth = await getEth();
  const accounts = await eth.request({ method: "eth_accounts" });
  return accounts && accounts.length;
}

//you request an account from your metamask
async function requestAccounts() {
  const eth = await getEth();
  const accounts = await eth.request({
    method: "eth_requestAccounts",
  });
  return accounts && accounts.length;
}

export async function deposit(secret, nullifier) {
  if (!(await hasAccounts()) && !(await requestAccounts())) {
    //asking metamask for accounts in it and requesting the account
    throw new Error("Please install metamask");
  }
  const mixer = new Contract(
    "0x500390299D3da7470805Af480D9dC759925F0C2C",
    Mixer.abi,
    new providers.Web3Provider(getEth()).getSigner()
  );
  const poseidon = await buildPoseidon();
  const F = poseidon.F;
  let commitment = F.toObject(poseidon([secret, nullifier]));
  await mixer.deposit(commitment, { value: utils.parseEther("10") });
}

export async function withdrawBySelf(secret, nullifier, to) {
  if (!(await hasAccounts()) && !(await requestAccounts())) {
    //asking metamask for accounts in it and requesting the account
    throw new Error("Please install metamask");
  }
  const mixer = new Contract(
    "0x500390299D3da7470805Af480D9dC759925F0C2C",
    Mixer.abi,
    new providers.Web3Provider(getEth()).getSigner()
  );
  const [a, b, c, input] = await getSolidityCallData(mixer, secret, nullifier);
  const receipt = await mixer.withdraw(to, 0, a, b, c, input);
  return "Successfully withdrew by self with hash" + receipt.msg;
}

export async function withdrawwithRelayer(
  secret,
  nullifier,
  to,
  fee,
  relayerAddr
) {
  if (!(await hasAccounts()) && !(await requestAccounts())) {
    //asking metamask for accounts in it and requesting the account
    throw new Error("Please install metamask");
  }
  const mixer = new Contract(
    "0x500390299D3da7470805Af480D9dC759925F0C2C",
    Mixer.abi,
    new providers.Web3Provider(getEth()).getSigner()
  );
  const [a, b, c, input] = await getSolidityCallData(mixer, secret, nullifier);
  const callData = await encodeCallData(to, fee, a, b, c, input);
  const txn = {
    to: mixer.address,
    data: callData,
    value: "0",
  };
  const receipt = await submitTx(relayerAddr, txn);
  return "Successfully withdrew using relayer with hash " + receipt.msg;
}
