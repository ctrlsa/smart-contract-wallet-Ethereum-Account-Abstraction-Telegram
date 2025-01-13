import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletId = searchParams.get("walletId");
    const userToken = searchParams.get("userToken");

    if (!walletId || !userToken) {
      return NextResponse.json(
        { error: "Wallet ID and user token are required" },
        { status: 400 }
      );
    }

    const response = await axios({
      method: "GET",
      url: `https://api.circle.com/v1/w3s/wallets/${walletId}/balances`,
      headers: {
        "X-User-Token": userToken,
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.data.tokenBalances);
    return NextResponse.json({
      balances: response.data.data.tokenBalances,
      challengeId: response.data.data.challengeId,
    });
  } catch (error: any) {
    console.error("Balance fetch error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to fetch balances" },
      { status: 500 }
    );
  }
}
