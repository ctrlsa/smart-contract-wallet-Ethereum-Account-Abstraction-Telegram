import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const response = await axios({
      method: "POST",
      url: "https://api.circle.com/v1/w3s/users/token",
      headers: {
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
      data: { userId },
    });

    return NextResponse.json({
      userToken: response.data.data.userToken,
      encryptionKey: response.data.data.encryptionKey,
    });
  } catch (error: any) {
    console.error("Error getting user token:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to get user token" },
      { status: 500 }
    );
  }
}
