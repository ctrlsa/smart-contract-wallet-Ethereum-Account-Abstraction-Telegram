import { joyidConnector } from "@joyid/wagmi";
import { createConfig, http } from "wagmi";
import { polygonMumbai, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [sepolia, polygonMumbai],
  transports: {
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
  },
  connectors: [
    joyidConnector({
      // name of your app
      name: "JoyID Rainbowkit demo",
      // logo of your app
      logo: "https://fav.farm/🆔",
      // JoyID app url that your app is integrated with
      joyidAppURL: "https://testnet.joyid.dev",
    }),
  ],
});
