import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const response = await axios({
      method: "GET",
      url: "https://api.circle.com/v1/w3s/wallets",
      params: { userId },
      headers: {
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      wallets: response.data.data.wallets,
    });
  } catch (error: any) {
    console.error("Error listing wallets:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to list wallets" },
      { status: 500 }
    );
  }
}
