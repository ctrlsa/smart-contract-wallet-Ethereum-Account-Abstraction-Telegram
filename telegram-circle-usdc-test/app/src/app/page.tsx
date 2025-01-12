"use client";

import { useState, useCallback } from "react";
import { Section, Cell, Button, Input, List } from "@telegram-apps/telegram-ui";

interface WalletData {
  wallet?: {
    id: string;
    state: string;
  };
  tokens?: Array<{
    token: {
      id: string;
      symbol: string;
    };
    amount: string;
  }>;
}

interface Transaction {
  id: string;
  status: string;
  amount: {
    amount: string;
    currency: string;
  };
  source: {
    type: string;
    address: string;
  };
  destination: {
    type: string;
    address: string;
  };
  createDate: string;
}

export default function Home() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");

  // Transfer form state
  const [transferData, setTransferData] = useState({
    amount: "",
    destinationAddress: "",
    tokenId: "",
  });

  const createWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/wallet/create", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create wallet");
      }

      const data = await response.json();
      console.log("Initial wallet creation response:", data); // For debugging

      if (data.challengeId && data.pin) {
        // Handle the challenge with the PIN
        const confirmResponse = await fetch("/api/wallet/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId: data.challengeId,
            userToken: data.userToken,
            pin: data.pin,
          }),
        });

        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json();
          throw new Error(
            errorData.error || "Failed to confirm wallet creation"
          );
        }

        const confirmData = await confirmResponse.json();
        console.log("Wallet confirmation response:", confirmData); // For debugging
        alert(`Wallet creation initiated successfully! PIN: ${data.pin}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Wallet creation error:", err);
      setError(err instanceof Error ? err.message : "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  const getWalletDetails = async (walletId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/wallet/${walletId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setWalletData(data);
      setSelectedWalletId(walletId);

      // Also fetch transactions
      const txResponse = await fetch(`/api/wallet/${walletId}/transactions`);
      const txData = await txResponse.json();

      if (!txResponse.ok) throw new Error(txData.message);

      setTransactions(txData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch wallet details"
      );
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedWalletId) throw new Error("No wallet selected");

      const response = await fetch(
        `/api/wallet/${selectedWalletId}/transactions/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transferData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Transaction initiated successfully!");
      // Refresh wallet details and transactions
      await getWalletDetails(selectedWalletId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <Cell>
        <h1 className="text-2xl font-bold mb-4">Circle USDC Wallet</h1>
      </Cell>

      <Cell>
        <Button onClick={createWallet} disabled={loading}>
          Create New Wallet
        </Button>
      </Cell>

      {error && (
        <Cell>
          <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
        </Cell>
      )}

      {selectedWalletId && walletData?.wallet && (
        <>
          <Cell>
            <h2 className="text-xl font-bold mt-4">Wallet Details</h2>
            <div className="mt-2">
              <p>Wallet ID: {walletData.wallet.id}</p>
              <p>State: {walletData.wallet.state}</p>
            </div>
          </Cell>

          <Cell>
            <h3 className="font-bold mt-4">Tokens</h3>
            <List>
              {walletData.tokens?.map((token) => (
                <Cell key={token.token.id}>
                  {token.token.symbol}: {token.amount}
                </Cell>
              ))}
            </List>
          </Cell>

          <Cell>
            <h3 className="font-bold mt-4">Send Transaction</h3>
            <div className="space-y-2">
              <Input
                placeholder="Amount"
                value={transferData.amount}
                onChange={(e) =>
                  setTransferData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Destination Address"
                value={transferData.destinationAddress}
                onChange={(e) =>
                  setTransferData((prev) => ({
                    ...prev,
                    destinationAddress: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Token ID"
                value={transferData.tokenId}
                onChange={(e) =>
                  setTransferData((prev) => ({
                    ...prev,
                    tokenId: e.target.value,
                  }))
                }
              />
              <Button onClick={sendTransaction} disabled={loading}>
                Send
              </Button>
            </div>
          </Cell>

          <Cell>
            <h3 className="font-bold mt-4">Recent Transactions</h3>
            <List>
              {transactions.map((tx) => (
                <Cell key={tx.id}>
                  <div className="text-sm">
                    <p>
                      Amount: {tx.amount.amount} {tx.amount.currency}
                    </p>
                    <p>Status: {tx.status}</p>
                    <p>Date: {new Date(tx.createDate).toLocaleString()}</p>
                  </div>
                </Cell>
              ))}
            </List>
          </Cell>
        </>
      )}

      {!selectedWalletId && (
        <Cell>
          <div className="mt-4">
            <Input
              placeholder="Enter Wallet ID"
              onChange={(e) => setSelectedWalletId(e.target.value)}
            />
            <Button
              onClick={() => getWalletDetails(selectedWalletId)}
              disabled={!selectedWalletId || loading}
            >
              Load Wallet
            </Button>
          </div>
        </Cell>
      )}
    </Section>
  );
}
