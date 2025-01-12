/**
 * @api {post} /wallet/:walletId/transactions/send Send Transaction
 * @apiName SendTransaction
 * @apiGroup Wallet
 * @apiDescription This API route is responsible for sending a transaction.
 * @apiParam {String} walletId The wallet id.
 * @apiBody {
 *  "fromAddress"?: "string",
 *  "tokenId": "string",
 *  "amount": "number",
 *  "destinationAddress": "string",
 *  "name"?: "string"
 * }
 */
import circleServer from "@/lib/circle-server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    const walletId = params.walletId; // get the wallet id from the params

    // get the fromAddress, tokenId, amount, destinationAddress and name from the request body
    const { fromAddress, tokenId, amount, destinationAddress, name } =
      await request.json();

    const userId = "123"; // get the user id from the session

    // create a new user token from circle server
    const tokenRes = await circleServer.createUserToken({
      userId,
    });
    // throw an error if the user token is null
    if (!tokenRes.data?.userToken) throw new Error("Error in fetching token");

    /**
     * Create a transaction with the user token, amounts, destinationAddress, tokenId, walletId and fee
     */
    const createTransaction = await circleServer.createTransaction({
      userToken: tokenRes.data.userToken,
      amounts: [`${amount}`],
      destinationAddress: destinationAddress,
      tokenId: tokenId,
      walletId: walletId,
      fee: {
        type: "level",
        config: {
          feeLevel: "MEDIUM",
        },
      },
    });

    // throw an error if the challenge id is null
    if (!createTransaction.data?.challengeId)
      throw new Error("Error in creating transaction");

    // return the challenge id, user token and encryption key
    return NextResponse.json({
      challengeId: createTransaction.data.challengeId,
      userToken: tokenRes.data.userToken,
      encryptionKey: tokenRes.data.encryptionKey,
    });
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
