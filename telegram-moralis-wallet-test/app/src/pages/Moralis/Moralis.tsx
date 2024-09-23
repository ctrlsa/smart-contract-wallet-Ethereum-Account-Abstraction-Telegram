import { FC, useEffect, useState } from "react";

import axios from "axios";

interface walletNFTTransfers {
  token_id: string;
  from_address: string;
  to_address: string;
  amount: string;
  block_timestamp: string;
}
interface ResponseType {
  address: string;
  nativeBalance: string;
  tokenBalances: string[];
  walletNFTTransfers: {
    result: {
      token_id: string;
      from_address: string;
      to_address: string;
      amount: string;
      block_timestamp: string;
    }[];
  };
}
export const Moralis: FC = () => {
  const [response, setResponse] = useState({});
  const [nftTransfers, setNftTransfers] = useState([]);

  useEffect(() => {
    axios("https://moralis-demo-backend.vercel.app/moralis").then(
      ({ data }) => {
        setResponse(data);
        setNftTransfers(data.walletNFTTransfers.result);
      }
    );
  }, []);

  return (
    <div>
      <h3>Wallet: {(response as ResponseType).address}</h3>
      <h3>Native Balance: {(response as ResponseType).nativeBalance} ETH</h3>
      <h3>Token Balances: </h3>
      <div>
        {(response as ResponseType).tokenBalances?.map((token) => {
          return <div key={token}>{token}</div>;
        })}
      </div>
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
              <tr key={(response as walletNFTTransfers).token_id}>
                <td>{(transfer as walletNFTTransfers).token_id}</td>
                <td>{(transfer as walletNFTTransfers).from_address}</td>
                <td>{(transfer as walletNFTTransfers).to_address}</td>
                <td>{(transfer as walletNFTTransfers).amount}</td>
                <td>{(transfer as walletNFTTransfers).block_timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
