import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // First create the user
    const createUserResponse = await axios({
      method: "POST",
      url: "https://api.circle.com/v1/w3s/users",
      headers: {
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
      data: { userId },
    });

    // Then get the user token
    const tokenResponse = await axios({
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
      userId: userId,
      userToken: tokenResponse.data.data.userToken,
      encryptionKey: tokenResponse.data.data.encryptionKey,
    });
  } catch (error: any) {
    console.error("User creation error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
