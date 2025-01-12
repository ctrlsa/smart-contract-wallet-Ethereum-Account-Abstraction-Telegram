"use client";

import { createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { http } from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 配置链和提供者
const transport = http();
const viemConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: transport,
  },
});

// 创建 WalletConnect 连接器
const connector = walletConnect({
  projectId: "fb5081e192ba2431eaee1939678f52f4",
  metadata: {
    name: "您的Dapp名称",
    description: "您的Dapp描述",
    url: "https://yourdapp.com",
    icons: ["https://yourdapp.com/logo.png"],
  },
  showQrModal: true,
  qrModalOptions: {
    explorerRecommendedWalletIds: ["b479590efeefdf98a5416e8cf2d48ebc"],
    themeMode: "dark",
    enableExplorer: false, // 如果只想显示特定钱包，设为 false
    mobileWallets: [
      {
        id: "b479590efeefdf98a5416e8cf2d48ebc",
        name: "您的钱包名称",
        links: {
          native: "yourwallet://",
          universal: "http://localhost:5174",
        },
      },
    ],
    desktopWallets: [
      // 如果有桌面版钱包，可以在这里添加
      {
        id: "b479590efeefdf98a5416e8cf2d48ebc",
        name: "您的钱包名称",
        links: {
          native: "yourwallet://",
          universal: "http://localhost:5174",
        },
      },
    ],
  },
});

// 创建 wagmi 配置
const config = createConfig({
  connectors: [connector],
  chains: [mainnet],
  transports: {
    [mainnet.id]: transport,
  },
});

// 创建包裹组件
function WalletConnectContent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
    } catch (error: any) {
      console.error("连接错误:", error);
      if (error.name === "ConnectorNotFoundError") {
        alert("请安装或打开指定的钱包应用");
      } else if (error.name === "UserRejectedRequestError") {
        alert("用户拒绝了连接请求");
      } else {
        alert("连接失败，请稍后重试");
      }
    }
  };

  if (isConnected) {
    return (
      <div className="p-4">
        <p className="mb-4">已连接地址: {address}</p>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          断开连接
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => handleConnect(connector)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          连接到{connector.name}
        </button>
      ))}
    </div>
  );
}

// 创建 QueryClient 实例
const queryClient = new QueryClient();

// 导出主组件
export function WalletConnect() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <WalletConnectContent />
      </WagmiConfig>
    </QueryClientProvider>
  );
}
