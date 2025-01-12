/**
 * @api {get} /users/set-pin Set Pin
 * @api {post} /users/set-pin Set Pin
 * @apiName SetPin
 * @apiGroup Users
 * @apiDescription This API route is responsible for setting the user pin.
 */
import circleServer from "@/lib/circle-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = "123"; // get the user id from the session

    // create a new user token from circle server
    const userAccess = await circleServer.createUserToken({
      userId,
    });

    // throw an error if the user token is null
    if (!userAccess.data?.userToken)
      throw new Error("Failed to create user token");

    // get user status to check if pin already exists from circle server
    const pinAlreadyExists = await circleServer.getUserStatus({
      userToken: userAccess.data.userToken,
    });

    // check if pin already Enabled
    if (pinAlreadyExists.data?.pinStatus == "ENABLED") {
      // get the wallets from circle server
      const wallets = await circleServer.listWallets({
        userToken: userAccess.data?.userToken,
      });

      // get the wallet ids from the wallets
      const walletIds = wallets.data?.wallets?.map((wallet) => wallet.id);

      // return the success message
      return NextResponse.json({ message: "Pin and wallet added." });
    }

    // if pin not enabled, create a new pin with wallets
    const challengId = await circleServer.createUserPinWithWallets({
      userId,
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA",
    });

    // throw an error if the challenge id is null
    if (!challengId.data?.challengeId)
      throw new Error("Failed to create challengeId");

    // return the challenge id, user token and encryption key
    return NextResponse.json({
      challengeId: challengId.data.challengeId,
      userToken: userAccess.data.userToken,
      encryptionKey: userAccess.data.encryptionKey,
    });
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = "123"; // get the user id from the session

    // create a new user token from circle server
    const userAccess = await circleServer.createUserToken({
      userId,
    });

    // throw an error if the user token is null
    if (!userAccess.data?.userToken) {
      throw new Error("Error in creating session");
    }

    // get the wallets from circle server
    const wallets = await circleServer.listWallets({
      userToken: userAccess.data.userToken,
    });

    // get the wallet ids from the wallets
    const walletIds = wallets.data?.wallets?.map((wallet) => wallet.id);

    // return the success message
    return NextResponse.json({ message: "Pin and wallet added." });
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
