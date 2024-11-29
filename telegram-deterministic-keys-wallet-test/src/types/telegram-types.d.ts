// telegram-types.d.ts

export {}; // Ensure this file is treated as a module.

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
      };
    };
  }
}
