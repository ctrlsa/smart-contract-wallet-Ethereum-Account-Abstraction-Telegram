import { FC, useEffect, useState } from "react";

import axios from "axios";

export const Balances: FC = () => {
  const [response, setResponse] = useState({});
  const [nftTransfers, setNftTransfers] = useState([]);

  useEffect(() => {
    axios("http://localhost:4000/balances").then(({ data }) => {
      setResponse(data);
      setNftTransfers(data.walletNFTTransfers.result);
    });
  }, []);

  return (
    <div>
      <h3>Wallet: {response.address}</h3>
      <h3>Native Balance: {response.nativeBalance} ETH</h3>
      <h3>Token Balances: {response.tokenBalances}</h3>
      <h3>NFT Transfers:</h3>
      <div
        style={{ maxHeight: "300px", overflowY: "auto", maxWidth: "1000px" }}
      >
        <table>
          <thead>
            <tr>
              <th>Token ID</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {nftTransfers.map((transfer) => (
              <tr key={transfer.token_id}>
                <td>{transfer.token_id}</td>
                <td>{transfer.from_address}</td>
                <td>{transfer.to_address}</td>
                <td>{transfer.amount}</td>
                <td>{transfer.block_timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
