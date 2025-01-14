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
      url: `https://api.circle.com/v1/w3s/users/${userId}`,
      headers: {
        Authorization:
          "Bearer TEST_API_KEY:e646884655dc61d9a17ffa2a6fd2dcb9:e7c23a5dbc3a9441b1194a406017b750",
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return NextResponse.json({
      pinStatus: response.data.data.user.pinStatus,
      hasPinEnabled: response.data.data.user.pinStatus === "ENABLED",
    });
  } catch (error: any) {
    console.error("Error getting user status:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to get user status" },
      { status: 500 }
    );
  }
}
