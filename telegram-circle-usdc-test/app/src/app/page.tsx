"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { W3SSdk, ChallengeResult } from "@circle-fin/w3s-pw-web-sdk";

type Step = "initial" | "setup-pin" | "create-wallet" | "manage-wallet";

// Initialize the SDK

interface TokenBalance {
  amount: string;
  token: {
    symbol: string;
    decimals: number;
    blockchain: string;
    tokenAddress: string;
  };
}

interface Wallet {
  id: string;
  state: string;
  walletSetId: string;
  custodyType: string;
  userId: string;
  address: string;
  blockchain: string;
  accountType: string;
  updateDate: string;
  createDate: string;
  balances?: TokenBalance[];
}

export default function Home() {
  const sdk = new W3SSdk();

  const [step, setStep] = useState<Step>("initial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [challengeId, setChallengeId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);

  // Load userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("circle_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      // If we have a userId, try to get a token
      getExistingUserToken(storedUserId);
    }
    sdk.setAppSettings({ appId: "da208e3c-d79c-57ca-8192-cf758156c7f1" });
  }, []);

  // Update SDK authentication when userToken or encryptionKey changes
  useEffect(() => {
    if (userToken && encryptionKey) {
      console.log(sdk);
      sdk.setAppSettings({ appId: "da208e3c-d79c-57ca-8192-cf758156c7f1" });

      sdk.setAuthentication({
        userToken,
        encryptionKey,
      });

      // Check if PIN is already set up
      checkPinStatus();
    }
  }, [userToken, encryptionKey]);

  // Check PIN status
  const checkPinStatus = async () => {
    try {
      if (!userId) return;
      console.log(userId);
      const response = await axios.get(`/api/users/status?userId=${userId}`);
      console.log(response.data);
      if (response.data.hasPinEnabled) {
        console.log("PIN is already enabled, skipping PIN setup");
        setStep("manage-wallet");
      }
    } catch (err: any) {
      console.error("Error checking PIN status:", err);
      // Don't show error to user, just proceed with PIN setup
    }
  };

  // Get token for existing user
  const getExistingUserToken = async (existingUserId: string) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/token", {
        userId: existingUserId,
      });

      setUserToken(response.data.userToken);
      setEncryptionKey(response.data.encryptionKey);

      // Check if PIN is already set up
      const statusResponse = await axios.get(
        `/api/users/status?userId=${existingUserId}`
      );
      console.log(statusResponse.data);
      if (statusResponse.data.hasPinEnabled) {
        console.log("PIN is already enabled, skipping PIN setup");
        setStep("manage-wallet");
      } else {
        setStep("setup-pin");
      }
    } catch (err: any) {
      console.error("Error getting existing user token:", err);
      setError(err.response?.data?.error || "Failed to get user token");
      localStorage.removeItem("circle_user_id");
      setUserId("");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(step);
    if (step === "setup-pin") {
      checkPinStatus();
    }
  }, [step]);
  // Create user and get token
  const createUser = async () => {
    try {
      setLoading(true);
      const newUserId = `user_${uuidv4()}`;

      const response = await axios.post("/api/users/create", {
        userId: newUserId,
      });

      localStorage.setItem("circle_user_id", newUserId);
      setUserId(newUserId);
      setUserToken(response.data.userToken);
      setEncryptionKey(response.data.encryptionKey);

      // Check if PIN is already set up (unlikely for new user, but good practice)
      const statusResponse = await axios.get(
        `/api/users/status?userId=${newUserId}`
      );
      if (statusResponse.data.hasPinEnabled) {
        console.log("PIN is already enabled, skipping PIN setup");
        setStep("manage-wallet");
      } else {
        setStep("setup-pin");
      }
    } catch (err: any) {
      console.error("User creation error:", err);
      setError(err.response?.data?.error || "Failed to create user");
      localStorage.removeItem("circle_user_id");
      setUserId("");
      setUserToken("");
    } finally {
      setLoading(false);
    }
  };

  // Create PIN challenge
  const createPinChallenge = async () => {
    try {
      if (!userToken) {
        throw new Error("No user token available. Please create a user first.");
      }
      setLoading(true);
      const response = await axios.post("/api/users/pin/challenge", {
        userToken,
      });

      const newChallengeId = response.data.challengeId;
      setChallengeId(newChallengeId);

      // Execute the challenge using the SDK
      console.log(sdk);
      await new Promise<ChallengeResult>((resolve, reject) => {
        const executeChallenge = () => {
          sdk.execute(newChallengeId, (error, result) => {
            if (error) {
              console.error(`Error executing challenge: ${error.message}`);
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error("No result from challenge execution"));
              return;
            }

            console.log(`Challenge: ${result.type}`);
            console.log(`status: ${result.status}`);

            if (result.status === "COMPLETE") {
              setStep("create-wallet");
              resolve(result);
            } else if (result.status === "IN_PROGRESS") {
              // If still in progress, wait 2 seconds and try again
              setTimeout(executeChallenge, 2000);
            } else {
              reject(
                new Error(`Challenge failed with status: ${result.status}`)
              );
            }
          });
        };

        // Start the polling
        executeChallenge();
      });
    } catch (err: any) {
      console.error("PIN challenge error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to create PIN challenge"
      );
    } finally {
      setLoading(false);
    }
  };

  // Create wallet
  const createWallet = async () => {
    try {
      if (!userToken) {
        throw new Error(
          "No user token available. Please set up your PIN first."
        );
      }
      setLoading(true);
      const response = await axios.post("/api/wallet/create", {
        userToken,
      });

      const newChallengeId = response.data.challengeId;

      // Execute the wallet creation challenge
      await new Promise<ChallengeResult>((resolve, reject) => {
        const executeChallenge = () => {
          sdk.execute(newChallengeId, (error, result) => {
            if (error) {
              console.error(`Error executing challenge: ${error.message}`);
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error("No result from challenge execution"));
              return;
            }

            console.log(`Challenge: ${result.type}`);
            console.log(`status: ${result.status}`);
            console.log(result);

            if (result.status === "COMPLETE") {
              setStep("manage-wallet");
              resolve(result);
            } else if (result.status === "IN_PROGRESS") {
              // If still in progress, wait 2 seconds and try again
              setTimeout(executeChallenge, 2000);
            } else {
              reject(
                new Error(`Challenge failed with status: ${result.status}`)
              );
            }
          });
        };

        // Start the polling
        executeChallenge();
      });
      console.log(response);
      console.log("Wallet created with ID:", response.data.walletId);
      setStep("manage-wallet");
    } catch (err: any) {
      console.error("Wallet creation error:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to create wallet"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    localStorage.removeItem("circle_user_id");
    setUserId("");
    setUserToken("");
    setEncryptionKey("");
    setStep("initial");
    setError(null);
  };

  // Load wallets when entering manage-wallet step
  useEffect(() => {
    if (step === "manage-wallet" && userId) {
      loadWallets();
    }
  }, [step, userId]);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/wallet/list?userId=${userId}`);
      setWallets(response.data.wallets);

      // Fetch balances for all wallets
      await Promise.all(
        response.data.wallets.map(async (wallet: Wallet) => {
          try {
            setLoadingBalances((prev) => ({ ...prev, [wallet.id]: true }));
            const balanceResponse = await axios.get(
              `/api/wallet/balances?walletId=${wallet.id}&userToken=${userToken}`
            );
            setWallets((prevWallets) =>
              prevWallets.map((w) =>
                w.id === wallet.id
                  ? { ...w, balances: balanceResponse.data.balances }
                  : w
              )
            );
          } catch (err: any) {
            console.error(
              `Error fetching balance for wallet ${wallet.id}:`,
              err
            );
          } finally {
            setLoadingBalances((prev) => ({ ...prev, [wallet.id]: false }));
          }
        })
      );
    } catch (err: any) {
      console.error("Error loading wallets:", err);
      setError(err.response?.data?.error || "Failed to load wallets");
    } finally {
      setLoading(false);
    }
  };

  const initiateTransfer = async () => {
    try {
      if (
        !selectedWallet ||
        !transferAmount ||
        !destinationAddress ||
        !selectedToken
      ) {
        setError("Please fill in all transfer details and select a token");
        return;
      }

      setLoading(true);
      console.log(selectedToken);
      const response = await axios.post("/api/wallet/transfer", {
        userToken,
        walletId: selectedWallet.id,
        destinationAddress,
        amount: transferAmount,
        tokenAddress: selectedToken.token.tokenAddress,
      });

      const newChallengeId = response.data.challengeId;

      // Execute the transfer challenge
      await new Promise<ChallengeResult>((resolve, reject) => {
        const executeChallenge = () => {
          sdk.execute(newChallengeId, (error, result) => {
            if (error) {
              console.error(`Error executing challenge: ${error.message}`);
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error("No result from challenge execution"));
              return;
            }

            console.log(`Challenge: ${result.type}`);
            console.log(`status: ${result.status}`);

            if (result.status === "COMPLETE") {
              resolve(result);
              // Reset form
              setShowTransferForm(false);
              setSelectedWallet(null);
              setSelectedToken(null);
              setTransferAmount("");
              setDestinationAddress("");
              // Reload wallets to show updated balances
              loadWallets();
            } else if (result.status === "IN_PROGRESS") {
              // If still in progress, wait 2 seconds and try again
              setTimeout(executeChallenge, 2000);
            } else {
              reject(
                new Error(`Challenge failed with status: ${result.status}`)
              );
            }
          });
        };

        // Start the polling
        executeChallenge();
      });
    } catch (err: any) {
      console.error("Transfer error:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to transfer"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalances = async (wallet: Wallet) => {
    try {
      setLoadingBalances((prev) => ({ ...prev, [wallet.id]: true }));
      const response = await axios.get(
        `/api/wallet/balances?walletId=${wallet.id}&userToken=${userToken}`
      );

      setWallets((prevWallets) =>
        prevWallets.map((w) =>
          w.id === wallet.id ? { ...w, balances: response.data.balances } : w
        )
      );
    } catch (err: any) {
      console.error("Balance fetch error:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to fetch balances"
      );
    } finally {
      setLoadingBalances((prev) => ({ ...prev, [wallet.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-black">Circle Wallet</h1>
            {userId && (
              <button
                onClick={clearUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Clear User
              </button>
            )}
          </div>

          {step === "initial" && (
            <div className="space-y-6">
              {userId ? (
                <p className="text-black">
                  Welcome back! User ID: {userId.slice(0, 8)}...
                </p>
              ) : (
                <p className="text-black">
                  Start by creating a new user account
                </p>
              )}
              <button
                onClick={
                  userId ? () => getExistingUserToken(userId) : createUser
                }
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : userId
                  ? "Continue with Existing Account"
                  : "Create User Account"}
              </button>
            </div>
          )}

          {step === "setup-pin" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-black">Set up PIN</h2>
              <button
                onClick={createPinChallenge}
                disabled={loading || !userToken}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Pin
              </button>
            </div>
          )}

          {step === "create-wallet" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-black">
                Create Wallet
              </h2>
              <p className="text-black">
                Create your Ethereum wallet on Sepolia testnet
              </p>
              <button
                onClick={createWallet}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Wallet"}
              </button>
            </div>
          )}

          {step === "manage-wallet" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-black">Your Wallets</h2>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-black">Loading wallets...</p>
                </div>
              ) : wallets.length > 0 ? (
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <p className="font-medium text-black">
                          Wallet ID: {wallet.id}
                        </p>
                        <p className="text-sm text-black break-all">
                          Address: {wallet.address}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-black text-xs rounded-full">
                            {wallet.blockchain}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-black text-xs rounded-full">
                            {wallet.accountType}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-black text-xs rounded-full">
                            {wallet.state}
                          </span>
                        </div>

                        {/* Balances Section */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-black">
                              Balances
                            </h4>
                            <button
                              onClick={() => fetchWalletBalances(wallet)}
                              disabled={loadingBalances[wallet.id]}
                              className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                            >
                              {loadingBalances[wallet.id]
                                ? "Loading..."
                                : "Refresh"}
                            </button>
                          </div>
                          {wallet.balances?.length ? (
                            <div className="space-y-2">
                              {wallet.balances.map((balance, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center text-sm text-black"
                                >
                                  <span className="text-black">
                                    {balance.token.symbol}
                                  </span>
                                  <span className="text-black">
                                    {parseFloat(balance.amount).toFixed(4)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-black">
                              No balances to display
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowTransferForm(true);
                          }}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full"
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={loadWallets}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Refresh Wallets
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-black mb-4">No wallets found</p>
                  <button
                    onClick={() => setStep("create-wallet")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Create New Wallet
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transfer Modal */}
          {showTransferForm && selectedWallet && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                <button
                  onClick={() => {
                    setShowTransferForm(false);
                    setSelectedWallet(null);
                    setSelectedToken(null);
                    setTransferAmount("");
                    setDestinationAddress("");
                  }}
                  className="absolute top-4 right-4 text-black hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <h3 className="text-lg font-medium text-black mb-4">
                  Transfer Funds
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      From Wallet
                    </label>
                    <div className="text-sm text-black break-all bg-gray-50 p-2 rounded">
                      {selectedWallet.address}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Select Token
                    </label>
                    <div className="space-y-2">
                      {selectedWallet.balances?.map((balance) => (
                        <button
                          key={balance.token.tokenAddress}
                          onClick={() => setSelectedToken(balance)}
                          className={`w-full p-3 rounded-md border ${
                            selectedToken?.token.tokenAddress ===
                            balance.token.tokenAddress
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          } transition-colors`}
                        >
                          <div className="flex justify-between items-center text-black">
                            <span className="font-medium">
                              {balance.token.symbol}
                            </span>
                            <span>{parseFloat(balance.amount).toFixed(4)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Destination Address
                    </label>
                    <input
                      type="text"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Enter destination address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Amount{" "}
                      {selectedToken && `(${selectedToken.token.symbol})`}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter amount"
                      />
                      {selectedToken && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-black">
                          Max: {parseFloat(selectedToken.amount).toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={initiateTransfer}
                      disabled={loading || !selectedToken}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : "Transfer"}
                    </button>
                    <button
                      onClick={() => {
                        setShowTransferForm(false);
                        setSelectedWallet(null);
                        setSelectedToken(null);
                        setTransferAmount("");
                        setDestinationAddress("");
                      }}
                      className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-black rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
