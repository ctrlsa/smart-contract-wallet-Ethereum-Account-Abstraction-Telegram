declare module "@circle-fin/w3s-pw-web-sdk" {
  export type ChallengeStatus = "COMPLETE" | "FAILED" | "PENDING";

  export interface ChallengeResult {
    type: string;
    status: ChallengeStatus;
  }

  export interface W3SSdkConfig {
    appId: string;
  }

  export interface AuthConfig {
    userToken: string;
    encryptionKey: string;
  }

  export class W3SSdk {
    constructor(config?: { appSettings: W3SSdkConfig });
    setAuthentication(config: AuthConfig): void;
    execute(
      challengeId: string,
      callback: (error: Error | null, result?: ChallengeResult) => void
    ): void;
    setAppSettings(config: W3SSdkConfig): void;
  }
}
