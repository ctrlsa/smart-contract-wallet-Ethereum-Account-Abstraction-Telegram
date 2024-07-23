"use client";

import { useCloudStorage } from "@/app/hooks/useCloudStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const Storage = () => {
  const [secretText, setSecretText] = useState("");
  const [localStorageSecret, setLocalStorageSecret] = useState("");

  const {
    handleRetrieveFromCloudStorage,
    handleStoreInCloudStorage,
    text: csText,
    error: csError,
    isLoading: csIsLoading,
  } = useCloudStorage();

  const handleStoreInLocalStorage = () => {
    localStorage.setItem("secret", secretText);
  };

  const handleRetrieveFromLocalStorage = () => {
    const secret = localStorage.getItem("secret");
    setLocalStorageSecret(secret || "");
  };

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    console.log("API", window.Telegram.WebApp);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="secret">Secret text</Label>
      <Input
        id="secret"
        placeholder="Type the text to store"
        value={secretText}
        onChange={(e) => setSecretText(e.target.value)}
      />

      <Label>Local Storage</Label>
      <Button onClick={handleStoreInLocalStorage}>
        Store secret in local storage
      </Button>
      <Button onClick={handleRetrieveFromLocalStorage}>
        Retrieve secret from local storage
      </Button>
      {localStorageSecret && (
        <div className="flex justify-between">
          <p>Secret from local storage:</p>
          <p>{localStorageSecret}</p>
        </div>
      )}

      <Separator />

      <Label>TG Cloud Storage</Label>
      <Button onClick={() => handleStoreInCloudStorage(secretText)}>
        Store secret in TG Cloud Storage
      </Button>
      <Button onClick={handleRetrieveFromCloudStorage}>
        Retrieve secret from TG Cloud Storage
      </Button>
      {csText && (
        <div className="flex justify-between">
          <p>Secret from Cloud Storage:</p>
          <p>{csText}</p>
        </div>
      )}
      {csError && (
        <div className="flex flex-col gap-1 text-red-500">
          <p>Cloud Storage error:</p>
          <p>{csError}</p>
        </div>
      )}
    </div>
  );
};

export default Storage;
