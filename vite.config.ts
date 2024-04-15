import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default () => {
  return defineConfig({
    plugins: [remixCloudflareDevProxy(), remix(), tsconfigPaths()],
  });
};
