"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Storage from "@/components/Storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Biometrics from "@/components/Biometrics";

const BOT_API_TOKEN = process.env.NEXT_PUBLIC_BOT_API_TOKEN;

export default function Home() {
  const [mode, setMode] = useState("biometrics");

  useEffect(() => {
    fetch(`https://api.telegram.org/bot${BOT_API_TOKEN}/getMe`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Telegram bot info", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  async function handleSendMessage() {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_API_TOKEN}/sendMessage`,
      {}
    );
    throw new Error("Function not implemented.");
  }

  console.log("mode", mode);

  return (
    <div className="flex w-full min-h-screen flex-col items-center justify-between">
      <div className="w-full max-w-5xl items-center justify-center text-sm flex flex-col gap-8 p-4">
        {/* {csIsLoading && (
          <div className="absolute top-4 righ-4">
            <Spinner />
          </div>
        )} */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet API test</CardTitle>
            <CardDescription>
              This app stores a secret text with different ways
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <p>This app stores a secret text with different ways</p> */}
            {mode === "storage" && <Storage />}
            {mode === "biometrics" && <Biometrics />}
          </CardContent>
        </Card>
      </div>
      <div
        id="footer"
        className="border-t border-black-300 w-full flex flex-row content-start items-center sticky bottom-0 bg-white dark:bg-background"
      >
        <div className="p-4 max-w-5xl w-full">
          <Select value={mode} onValueChange={(value) => setMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="storage">Storage</SelectItem>
              <SelectItem value="biometrics">Biometrics</SelectItem>
              {/* <SelectItem value="system">System</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
