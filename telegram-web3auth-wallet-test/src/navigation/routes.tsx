import type { ComponentType, JSX } from "react";

import { IndexPage } from "@/pages/IndexPage/IndexPage";
import { InitDataPage } from "@/pages/InitDataPage/InitDataPage";
import { LaunchParamsPage } from "@/pages/LaunchParamsPage/LaunchParamsPage.tsx";
import { ThemeParamsPage } from "@/pages/ThemeParamsPage/ThemeParamsPage.tsx";
import { Web3AuthConnectPage } from "@/pages/Web3AuthConnectPage/Web3AuthConnectPage";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: "/", Component: IndexPage },
  { path: "/init-data", Component: InitDataPage, title: "Init Data" },
  { path: "/theme-params", Component: ThemeParamsPage, title: "Theme Params" },
  {
    path: "/launch-params",
    Component: LaunchParamsPage,
    title: "Launch Params",
  },
  {
    path: "/web3-auth-connect",
    Component: Web3AuthConnectPage,
    title: "Web3 Auth Connect",
  },
];
