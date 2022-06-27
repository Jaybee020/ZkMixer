import React from "react";
import Form from "./Form";
import { deposit } from "../helpers/main";
import { useEffect, useState } from "react";
import { getMixer } from "../helpers/helpers";

const Deposit = () => {
  const submit = async (data) => {
    const { secret, nullifier } = data;
    await deposit(parseInt(secret), parseInt(nullifier));
  };
  const [message, setMessage] = useState("");

  useEffect(() => {
    const setValue = async () => {
      const mixer = await getMixer();
      mixer.on("Deposit", (commitment, index, timestamp) => {
        setMessage(
          `Deposit Successfully performed at  ${timestamp}. New Index is ${index}`
        );
      });
    };

    setValue();
  }, []);

  return <Form submitFn={submit} type={"Deposit"} message={message}></Form>;
};

export default Deposit;
