/**
 * This file exports the Circle API client.
 * It is used to create a new Circle API client.
 */

import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";

// Initialize the Circle client with the correct base URL for the W3S API
const circleServer = initiateUserControlledWalletsClient({
  apiKey:
    "TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
  baseUrl: "https://api.circle.com/v1/w3s", // Changed to include w3s in the base URL
});

export interface CircleWalletResponse {
  challengeId?: string;
  userToken?: string;
  encryptionKey?: string;
  walletId?: string;
  error?: string;
}

export const createUserToken = async (userId: string) => {
  try {
    // Create user token with proper error handling
    const response = await circleServer.createUserToken({
      userId,
    });

    if (!response?.data) {
      throw new Error("No data received from Circle API");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error creating user token:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "Failed to create user token"
    );
  }
};

export const createWalletWithPin = async (userId: string) => {
  try {
    // Create wallet with proper configuration
    const response = await circleServer.createUserPinWithWallets({
      userId,
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA",
      idempotencyKey: `${userId}-${Date.now()}`, // Add idempotency key
    });

    if (!response?.data) {
      throw new Error("No data received from Circle API");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error creating wallet:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to create wallet");
  }
};

export default circleServer;
