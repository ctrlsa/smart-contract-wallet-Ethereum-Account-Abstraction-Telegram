/**
 * @api {get} /api/users/forget-pin Forget Pin
 * @apiName ForgetPin
 * @apiGroup Users
 * @apiDescription This API route is responsible for forgetting the user pin.
 */
import circleServer from "@/lib/circle-server";
import { NextRequest, NextResponse } from "next/server";

// This is a dynamic route setting for vercel deployment
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = "123"; // get the user id from the session

    // create a new user token from circle server
    const tokenResponse = await circleServer.createUserToken({
      userId,
    });

    // throw an error if the user token is null
    if (!tokenResponse.data?.userToken)
      throw new Error("Failed to create user token");

    // get the challenge id from the circle server to restore the user pin
    const res = await circleServer.restoreUserPin({
      userToken: tokenResponse.data?.userToken,
    });

    // throw an error if the challenge id is null
    if (!res.data?.challengeId) throw new Error("Failed to create challengId");

    // return the challenge id, user token and encryption key
    return NextResponse.json({
      challengeId: res.data.challengeId,
      userToken: tokenResponse.data.userToken,
      encryptionKey: tokenResponse.data.encryptionKey,
    });
  } catch (error: any) {
    // catch the error and log the error
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
