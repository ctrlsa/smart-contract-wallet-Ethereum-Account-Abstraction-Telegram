/**
 * @api {get} /wallet/:walletId/transactions Get Transactions
 * @apiName GetTransactions
 * @apiGroup Wallet
 * @apiDescription This API route is responsible for getting the wallet transactions.
 * @apiParam {String} walletId The wallet id.
 */
import { auth } from "@/auth";
import circleServer from "@/lib/circle-server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    const walletId = params.walletId; // get the wallet id from the params

    const session = await auth(); // get the session from the auth function
    if (!session) throw new Error("Unauthenticated"); // throw an error if the session is null

    const userId = session.user.id; // get the user id from the session

    // create a new user token from circle server
    const tokenRes = await circleServer.createUserToken({
      userId,
    });

    // throw an error if the user token is null
    if (!tokenRes.data?.userToken) throw new Error("Error in fetching token");

    // get the transactions from circle server
    const transactionsLists = await circleServer.listTransactions({
      userToken: tokenRes.data.userToken,
      walletIds: [walletId],
      pageSize: 10,
    });

    // throw an error if the transactions are null
    if (!transactionsLists.data?.transactions)
      throw new Error("Error in fetching transations");

    // get the transactions from the transactionsLists
    const transactions = transactionsLists.data.transactions;

    // return the transactions
    return NextResponse.json(transactions);
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
