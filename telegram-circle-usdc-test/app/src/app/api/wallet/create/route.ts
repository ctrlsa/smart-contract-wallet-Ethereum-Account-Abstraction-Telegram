/**
 * @api {get} /wallet/create Create Wallet
 * @api {post} /wallet/create Create Wallet
 * @apiName CreateWallet
 * @apiGroup Wallet
 * @apiDescription This API route is responsible for creating a new wallet.
 */

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { userToken } = await req.json();

    const response = await axios({
      method: "POST",
      url: "https://api.circle.com/v1/w3s/user/wallets",
      headers: {
        "X-User-Token": userToken,
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
      data: {
        idempotencyKey: "c9afb154-0417-4c60-93dc-591fc89393c2",
        accountType: "EOA",
        blockchains: ["ETH-SEPOLIA"],
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);
    console.error("Wallet creation error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to create wallet" },
      { status: 500 }
    );
  }
}
