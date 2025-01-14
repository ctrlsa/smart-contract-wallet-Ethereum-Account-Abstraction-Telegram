import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { userToken } = await req.json();

    const response = await axios({
      method: "POST",
      url: "https://api.circle.com/v1/w3s/user/pin",
      headers: {
        "X-User-Token": userToken,
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
      data: {
        idempotencyKey: uuidv4(),
      },
    });

    return NextResponse.json({
      challengeId: response.data.data.challengeId,
    });
  } catch (error: any) {
    console.error("PIN challenge error:", error.response?.data || error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message || "Failed to create PIN challenge",
      },
      { status: 500 }
    );
  }
}
