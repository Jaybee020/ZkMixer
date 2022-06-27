import React from "react";
import Form from "./Form";
import { utils } from "ethers";
import { withdraw } from "../helpers/main";
import { useState } from "react";

const Withdraw = ({ useRelayer, toggleFn }) => {
  const [message, setMessage] = useState("");
  const submit = async (data) => {
    console.log(data);
    const { secret, nullifier, receiverAddr, relayerLocator, fee } = data;
    const feeInOne = utils.parseEther(fee);
    const status = await withdraw(
      parseInt(secret),
      parseInt(nullifier),
      receiverAddr,
      feeInOne,
      relayerLocator
    );
    setMessage(status);
  };
  return (
    <Form
      submitFn={submit}
      type={"Withdraw"}
      useRelayer={useRelayer}
      toggleFn={toggleFn}
      message={message}
    ></Form>
  );
};

export default Withdraw;
