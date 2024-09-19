"use client";

import { Button } from "@/components/ui/button";
import { config } from "@/wagmi";
import { joyidConnector } from "@joyid/wagmi";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { sepolia } from "wagmi/chains";

export default function JoyIdTestPage() {
  const [response, setResponse] = useState("");

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync } = useConnect({
    // connector: joyidConnector,
    config: config,
  });

  const onConnect = async () => {
    try {
      await connectAsync({
        chainId: sepolia.id,
        connector: joyidConnector({
          // name of your app
          name: "JoyID Rainbowkit demo",
          // logo of your app
          logo: "https://fav.farm/🆔",
          // JoyID app url that your app is integrated with
          joyidAppURL: "https://testnet.joyid.dev",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const storeTokenAddressPair = async ({
    token,
    address,
  }: {
    token: string;
    address: string;
  }) => {
    const res = await fetch("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        message: { address },
      }),
    });
    const data = await res.json();
    console.log(data);
    setResponse(data);
  };

  const retrieveTokenAddressPair = async ({ token }: { token: string }) => {
    const res = await fetch(`/messages/${token}`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    setResponse(data);
  };

  // const wrongCallBackend = async () => {
  //   const res = await fetch("/messages", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       token:
  //         "conncd6f828cfb86eba318e4f85733c9178fd6c7c45256034604f67463c36282d2cc9e4ab642",
  //       message: { address1: "0x8ac36d0e764FF17dcF13b2465e77b4fe125EC2bC" },
  //     }),
  //   });
  //   const data = await res.json();
  //   console.log(data);
  //   setResponse(data);
  // };

  return (
    <div className="flex flex-col w-full h-full justify-start p-8">
      <div>test joy page</div>
      <button
        onClick={() =>
          storeTokenAddressPair({
            token:
              "conncd6f828cfb86eba318e4f85733c9178fd6c7c45256034604f67463c36282d2cc9e4ab642",
            address: "0x8ac36d0e764FF17dcF13b2465e77b4fe125EC2bC",
          })
        }
      >
        success call
      </button>
      <button
        onClick={() =>
          retrieveTokenAddressPair({
            token:
              "conncd6f828cfb86eba318e4f85733c9178fd6c7c45256034604f67463c36282d2cc9e4ab642",
          })
        }
      >
        success get
      </button>
      <button
        onClick={() =>
          retrieveTokenAddressPair({
            token:
              "conncd6f828cfb86eba318e4f85733c9178f36c7c45256034604f67463c36282d2cc9e4ab642",
          })
        }
      >
        fail get
      </button>
      <div>
        <Button onClick={onConnect}>Connect JoyID</Button>
      </div>
      <div>address: {address}</div>
      {response ? (
        <div>{JSON.stringify(response)}</div>
      ) : (
        <div>No response data</div>
      )}
    </div>
  );
}
