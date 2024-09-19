import { type NextRequest } from "next/server";

// maps token -> address

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("request body", body);
  const { token, message } = body;

  if (!token || !message || !message.address)
    return new Response(
      JSON.stringify({ message: "Missing token or message" })
    );

  if (request.method === "POST") {
    // Process a POST request
    console.log("body", request.body);

    global.cacheUser.set(token, message.address);

    return new Response(JSON.stringify({ message: "Hello, All good" }), {
      status: 200,
      // headers: { 'Set-Cookie': `token=${token.value}` },
    });
  } else {
    return new Response(
      JSON.stringify({ message: "Only post method is supported" }),
      {
        status: 405,
      }
    );
  }
}
