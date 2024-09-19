import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  console.log("request param token", params.token);

  if (!params.token) {
    return new Response(JSON.stringify({ message: { address: "rejected" } }));
  }

  console.log("body", request.body);
  const mappedAddress = global.cacheUser.get(params.token);

  if (mappedAddress) {
    return new Response(
      JSON.stringify({ message: { address: mappedAddress } }),
      {
        status: 200,
      }
    );
  }

  // Handle any other HTTP method
  return new Response(JSON.stringify({ message: { address: "rejected" } }), {
    status: 405,
  });
}
