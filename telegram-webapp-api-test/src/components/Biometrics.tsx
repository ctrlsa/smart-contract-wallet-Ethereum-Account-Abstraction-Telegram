"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import WebApp from "@twa-dev/sdk";

const Biometrics = () => {
  const [data, setData] = useState<Record<string, any>>();
  const [version, setVersion] = useState<string>();
  const [token, setToken] = useState<string>();
  const { toast } = useToast();

  const updateBiometricData = () => {
    const webApp = window.Telegram.WebApp.BiometricManager;
    setData({
      isInited: webApp.isInited,
      isBiometricAvailable: webApp.isBiometricAvailable,
      biometricType: webApp.biometricType,
      isAccessRequested: webApp.isAccessRequested,
      isAccessGranted: webApp.isAccessGranted,
      isBiometricTokenSaved: webApp.isBiometricTokenSaved,
    });
  };

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    // Webapp.rea
    tg.BiometricManager.init(() => {
      toast({
        title: "Biometric Init complete",
      });
    });
    updateBiometricData();
    setVersion(tg.version);
    // console.log("API", window.Telegram.WebApp);
    // setData(window.Telegram.WebApp.);
  }, []);

  const handleRequestAccess = () => {
    window.Telegram.WebApp.BiometricManager.requestAccess(
      "Request to access biometrics",
      (success: boolean) => {
        console.log("Request access", { success });
        toast({
          title: "Request access",
          description: `Success: ${success}`,
        });
      }
    );
  };

  const handleAuthenticate = () => {
    window.Telegram.WebApp.BiometricManager.authenticate(
      "Request to authenticate biometrics",
      (success: boolean, bioToken?: string) => {
        console.log("Authenticate", { success, bioToken });
        if (success) {
          // WebApp.HapticFeedback.notificationOccurred("success");
          setToken(bioToken);
          toast({
            title: "Authenticate",
            description: `Success: ${success}, token: ${bioToken}`,
          });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {version && <p>Version: {version}</p>}
        {token && <p>Bio token: {token}</p>}
        {/* <p>Version: {window.Telegram.WebApp.version}</p> */}
        <h2 className="text-base">Biometric status</h2>
        {data &&
          Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <p>{key}</p>
              <p>{value.toString()}</p>
            </div>
          ))}
        <Button size="sm" onClick={() => updateBiometricData()}>
          Refresh biometric data
        </Button>
      </div>

      <Separator />

      <Button size="sm" onClick={handleRequestAccess}>
        Request access
      </Button>
      <Button size="sm" onClick={handleAuthenticate}>
        Authenticate
      </Button>
      <Button
        size="sm"
        onClick={() => window.Telegram.WebApp.BiometricManager.openSettings()}
      >
        Open Settings
      </Button>
    </div>
  );
};

export default Biometrics;
