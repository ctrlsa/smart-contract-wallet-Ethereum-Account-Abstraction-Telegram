import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PUT(req: NextRequest) {
  try {
    const { userToken, challengeId, pin } = await req.json();

    const response = await axios({
      method: "PUT",
      url: "https://api.circle.com/v1/w3s/users/pin",
      headers: {
        "X-User-Token": userToken,
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
      data: {
        challengeId,
        pin,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("PIN setup error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to set PIN" },
      { status: 500 }
    );
  }
}
