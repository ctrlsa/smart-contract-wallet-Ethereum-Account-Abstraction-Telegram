/**
 * This file exports the Circle API client.
 * It is used to create a new Circle API client.
 */

const CIRCLE_API_KEY =
  "TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750";
const BASE_URL = "https://api.circle.com/v1/w3s";

interface CircleApiResponse<T> {
  data: T;
  error?: {
    code: number;
    message: string;
  };
}

// Helper function for API calls
const circleApiCall = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<CircleApiResponse<T>> => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CIRCLE_API_KEY}`,
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "API call failed");
  }

  return data;
};

// Create User Token
export const createUserToken = async (userId: string) => {
  return circleApiCall("/users/token", {
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
  });
};

// Create Wallet
export const createWallet = async (userToken: string) => {
  return circleApiCall("/user/wallets", {
    method: "POST",
    body: JSON.stringify({
      idempotencyKey: crypto.randomUUID(),
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA",
    }),
    headers: {
      "X-User-Token": userToken,
    },
  });
};

// List Wallets
export const listWallets = async (userToken: string) => {
  return circleApiCall("/user/wallets", {
    method: "GET",
    headers: {
      "X-User-Token": userToken,
    },
  });
};

// Get Wallet Details
export const getWalletDetails = async (walletId: string, userToken: string) => {
  return circleApiCall(`/user/wallets/${walletId}`, {
    method: "GET",
    headers: {
      "X-User-Token": userToken,
    },
  });
};

// Create Transaction
export const createTransaction = async (
  walletId: string,
  userToken: string,
  destinationAddress: string,
  amount: string,
  tokenId: string
) => {
  return circleApiCall(`/user/wallets/${walletId}/transactions`, {
    method: "POST",
    body: JSON.stringify({
      idempotencyKey: crypto.randomUUID(),
      destinationAddress,
      amount,
      tokenId,
      fee: {
        type: "level",
        config: {
          feeLevel: "MEDIUM",
        },
      },
    }),
    headers: {
      "X-User-Token": userToken,
    },
  });
};

// Get Transaction Details
export const getTransactionDetails = async (
  walletId: string,
  transactionId: string,
  userToken: string
) => {
  return circleApiCall(
    `/user/wallets/${walletId}/transactions/${transactionId}`,
    {
      method: "GET",
      headers: {
        "X-User-Token": userToken,
      },
    }
  );
};

// List Transactions
export const listTransactions = async (walletId: string, userToken: string) => {
  return circleApiCall(`/user/wallets/${walletId}/transactions`, {
    method: "GET",
    headers: {
      "X-User-Token": userToken,
    },
  });
};
