import { FC, useEffect, useState } from "react";

import axios from "axios";

export const Balances: FC = () => {
  const [balances, setBalances] = useState({});

  useEffect(() => {
    axios("http://localhost:4000/balances").then(({ data }) => {
      setBalances(data);
    });
  }, []);

  return (
    <div>
      <h3>Wallet: {balances.address}</h3>
      <h3>Native Balance: {balances.nativeBalance} ETH</h3>
      <h3>Token Balances: {balances.tokenBalances}</h3>
    </div>
  );
};
