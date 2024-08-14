import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import { type FC, useEffect } from 'react';

import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { PrivyProvider } from '@privy-io/react-auth';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

const Inner: FC = () => {
  const debug = useLaunchParams().startParam === 'debug';
  // const manifestUrl = useMemo(() => {
  //   return new URL('tonconnect-manifest.json', window.location.href).toString();
  // }, []);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <PrivyProvider
      appId={ import.meta.env.VITE_PRIVY_APP_ID }
      config={{
        // Display email and wallet as login methods
        loginMethods: ['email', 'wallet'],
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          walletList: [ 'metamask' ],
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
    {/* <TonConnectUIProvider manifestUrl={manifestUrl}> */}
      <SDKProvider acceptCustomStyles debug={debug}>
        <App/>
      </SDKProvider>
    {/* </TonConnectUIProvider> */}
    </PrivyProvider>
  );
};

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner/>
  </ErrorBoundary>
);
