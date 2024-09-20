"use client";

import { Button } from "@/components/ui/button";
import { config } from "@/wagmi";
import { joyidConnector } from "@joyid/wagmi";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { sepolia } from "wagmi/chains";
import { CircleCheck, CircleAlert } from "lucide-react";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function JoyIdTestPage() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync } = useConnect({
    config: config,
  });

  useEffect(() => {
    WebApp.ready();
  }, []);

  const onConnect = async () => {
    try {
      await connectAsync({
        chainId: sepolia.id,
        connector: joyidConnector({
          // name of your app
          name: "JoyID Passkey demo",
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

  return (
    <div className="flex flex-col w-full h-full items-center p-8 ">
      <div className="max-w-xl w-full flex flex-col justify-start space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight pb-4">
          JoyID test page
        </h3>
        <div>
          {address ? (
            <Button
              suppressHydrationWarning
              variant={"destructive"}
              onClick={() => disconnect()}
            >
              Disconnect JoyID
            </Button>
          ) : (
            <Button onClick={onConnect}>Connect JoyID</Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div>Status:</div>
          {address ? (
            <div className="text-green-500">Connected</div>
          ) : (
            <div className="text-red-500">Not Connected</div>
          )}
          {address ? (
            <CircleCheck className="ml-2 h-4 w-4 text-green-500" />
          ) : (
            <CircleAlert className="ml-2 h-4 w-4 text-red-500" />
          )}
        </div>
        <div>
          Address: <span className="font-mono text-sm">{address ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}
