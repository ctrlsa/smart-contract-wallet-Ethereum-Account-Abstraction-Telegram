/**
 * @api {get} /wallet/create Create Wallet
 * @api {post} /wallet/create Create Wallet
 * @apiName CreateWallet
 * @apiGroup Wallet
 * @apiDescription This API route is responsible for creating a new wallet.
 */

import { createUserToken, createWalletWithPin } from "@/lib/circle-server";
import { NextRequest, NextResponse } from "next/server";

// Helper function to generate a secure PIN
const generateSecurePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function GET(req: NextRequest) {
  try {
    const userId = "123";
    const pin = generateSecurePin(); // Generate a 6-digit PIN

    // First create a user token
    const userToken = await createUserToken(userId);

    if (!userToken) {
      throw new Error("Failed to create user token");
    }

    // Create wallet with PIN
    const walletResponse = await createWalletWithPin(userId);

    if (!walletResponse?.challengeId) {
      throw new Error("No challenge ID received from Circle");
    }

    return NextResponse.json({
      challengeId: walletResponse.challengeId,
      userToken: userToken.userToken,
      encryptionKey: userToken.encryptionKey,
      pin, // Include the PIN in the response (in production, handle this securely)
    });
  } catch (error: any) {
    console.error("Wallet creation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create wallet",
        details: error.response?.data || error,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, userToken, pin } = body;

    if (!challengeId || !userToken || !pin) {
      throw new Error("Missing required parameters");
    }

    // Here you would handle the challenge response with the PIN
    // For now, we'll just return success
    return NextResponse.json({
      message: "Wallet creation initiated",
      walletStatus: "PENDING_ACTIVATION",
    });
  } catch (error: any) {
    console.error("Wallet confirmation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm wallet creation" },
      { status: 500 }
    );
  }
}
