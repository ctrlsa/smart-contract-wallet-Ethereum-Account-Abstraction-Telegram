"use client";

import { useState, useEffect } from "react";
import { Section, Cell, Button, Input } from "@telegram-apps/telegram-ui";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { W3SSdk, ChallengeResult } from "@circle-fin/w3s-pw-web-sdk";

type Step = "initial" | "setup-pin" | "create-wallet" | "manage-wallet";

// Initialize the SDK

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
          } else {
            reject(new Error(`Challenge failed with status: ${result.status}`));
          }
        });
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

  // Set PIN
  const setUserPin = async () => {
    try {
      if (!challengeId) {
        throw new Error(
          "No challenge ID available. Please create a PIN challenge first."
        );
      }
      if (!pin || pin.length !== 6) {
        throw new Error("Please enter a valid 6-digit PIN.");
      }
      setLoading(true);
      await axios.put("/api/users/pin/set", {
        userToken,
        challengeId,
        pin,
      });

      setStep("create-wallet");
    } catch (err: any) {
      console.error("PIN setup error:", err);
      setError(err.response?.data?.error || "Failed to set PIN");
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
            setStep("manage-wallet");
            resolve(result);
          } else {
            reject(new Error(`Challenge failed with status: ${result.status}`));
          }
        });
      });

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

  return (
    <Section>
      <Cell>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Circle Wallet Setup</h1>

          {step === "initial" && (
            <div className="space-y-4">
              {userId ? (
                <p className="text-gray-600">
                  Welcome back! User ID: {userId.slice(0, 8)}...
                </p>
              ) : (
                <p className="text-gray-600">
                  Start by creating a new user account
                </p>
              )}
              <Button
                onClick={
                  userId ? () => getExistingUserToken(userId) : createUser
                }
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : userId
                  ? "Continue with Existing Account"
                  : "Create User Account"}
              </Button>
              {userId && (
                <Button
                  onClick={() => {
                    localStorage.removeItem("circle_user_id");
                    setUserId("");
                    setUserToken("");
                    setStep("initial");
                  }}
                  className="mt-2"
                >
                  Use Different Account
                </Button>
              )}
            </div>
          )}

          {step === "setup-pin" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Set up PIN</h2>
              <Input
                type="password"
                placeholder="Enter 6-digit PIN"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <div className="space-x-2">
                <Button
                  onClick={createPinChallenge}
                  disabled={loading || !userToken}
                >
                  Create Challenge
                </Button>
                <Button
                  onClick={setUserPin}
                  disabled={loading || !challengeId || pin.length !== 6}
                >
                  Set PIN
                </Button>
              </div>
            </div>
          )}

          {step === "create-wallet" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Create Wallet</h2>
              <p className="text-gray-600">
                Create your Ethereum wallet on Sepolia testnet
              </p>
              <Button onClick={createWallet} disabled={loading}>
                {loading ? "Creating..." : "Create Wallet"}
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </Cell>
    </Section>
  );
}
