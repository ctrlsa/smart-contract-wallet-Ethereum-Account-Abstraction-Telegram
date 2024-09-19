// telegram-types.d.ts

export {}; // Ensure this file is treated as a module.

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        version: string;
        CloudStorage: {
          setItem(key: string, value: string, callback: any): void;
          getItem(key: string, callback: any): void;
          // Add other methods you need here
        };
        BiometricManager: {
          isInited: boolean;
          isBiometricAvailable: boolean;
          biometricType: string;
          isAccessRequested: boolean;
          isAccessGranted: boolean;
          isBiometricTokenSaved: boolean;
          deviceId: string;
          init: (callback: any) => void;
          requestAccess: (reason: string, callback?: any) => void;
          authenticate: (reason: string, callback?: any) => void;
          openSettings: () => void;
        };
        // Include other nested properties of Telegram.WebApp as needed
      };
    };
  }
}
