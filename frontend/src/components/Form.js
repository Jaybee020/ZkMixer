import { TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { FormControlLabel, Switch } from "@mui/material";
import { useForm } from "react-hook-form";

const Form = ({ type, useRelayer, toggleFn, submitFn, message }) => {
  const { register, handleSubmit } = useForm();
  return (
    <div className="formBox">
      <div>
        <Link className="link" to={type === "Withdraw" ? "/" : "/withdraw"}>
          {type === "Withdraw" ? "Deposit" : "Withdraw"}
        </Link>
      </div>
      <form onSubmit={handleSubmit((data) => submitFn(data))}>
        <span style={{ marginRight: 80 }}>
          <TextField
            {...register("secret")}
            className="formInput"
            label="Secret"
            variant="standard"
          />
        </span>
        <span>
          <TextField
            {...register("nullifier")}
            className="formInput"
            label="Nullifier"
            variant="standard"
          />
        </span>

        <div className="info">
          {type === "Withdraw" ? (
            ""
          ) : (
            <small>Depositing in this contract costs 10 ONE</small>
          )}
        </div>

        {type === "Withdraw" ? (
          <div>
            <TextField
              {...register("receiverAddr")}
              style={{ marginBottom: 10 }}
              label="Receiver Address"
              variant="outlined"
            />
          </div>
        ) : (
          ""
        )}
        {type === "Withdraw" ? (
          <FormControlLabel
            onClick={toggleFn}
            control={<Switch defaultChecked />}
            label="Relayer"
          />
        ) : (
          ""
        )}
        {type === "Withdraw" && useRelayer ? (
          <div style={{ marginTop: 20 }}>
            <TextField
              {...register("relayerLocator")}
              style={{ marginLeft: 0 }}
              label="Relayer Locator Used"
              variant="outlined"
            />
            <TextField
              {...register("fee")}
              style={{ marginLeft: 30 }}
              label="Fee"
              variant="outlined"
            />
            <div className="relayLink">
              <Link to="/relayers">Get Relayers</Link>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="btn">
          <Button type="submit" variant="contained">
            {type}
          </Button>
        </div>
        <small>{message}</small>
      </form>
    </div>
  );
};

export default Form;
