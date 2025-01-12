/**
 * @api {get} /wallet/:walletId Get Wallet
 * @apiName GetWallet
 * @apiGroup Wallet
 * @apiDescription This API route is responsible for getting the wallet details.
 * @apiParam {String} walletId The wallet id.
 */

import circleServer from "@/lib/circle-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { walletId: string } }
) {
  try {
    const walletId = params.walletId; // get the wallet id from the params

    // throw an error if the wallet id is null
    if (!walletId || walletId == "null") throw new Error("WalletId required");

    const userId = "123"; // get the user id from the session

    // create a new user token from circle server
    const userAccess = await circleServer.createUserToken({
      userId,
    });

    // throw an error if the user token is null
    if (!userAccess.data?.userToken)
      throw new Error("Error in creating session");

    // get the wallets from circle server
    const wallets = await circleServer.listWallets({
      userToken: userAccess.data.userToken,
    });

    // get the tokens from circle server
    const tokens = await circleServer.getWalletTokenBalance({
      walletId,
      userToken: userAccess.data.userToken,
    });

    // throw an error if the wallet is not found
    if (!wallets.data?.wallets) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }

    // get the wallet from the wallets
    const wallet = wallets.data.wallets.find((w) => w.id == walletId);

    //  return the wallet and tokens
    return NextResponse.json({
      wallet,
      tokens: tokens.data?.tokenBalances,
    });
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}
