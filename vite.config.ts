import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { vercelPreset } from '@vercel/remix/vite';
import { parse } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import { ConfigEnv, defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

// Load and parse .env.sample to get the necessary (whitelisted) environment variables
const envSample = readFileSync(resolve(process.cwd(), ".env.sample"));
const parsedEnvSample = parse(envSample);
const ENV_WHITELIST = [...Object.keys(parsedEnvSample)];

export default ({ mode }: ConfigEnv) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  // This collects the whitelisted environment variables from the global process.env object
  const env = ENV_WHITELIST.reduce((prev, current): Record<string, string> => {
    if (!process.env[current]) {
      console.warn(
        "\x1b[33m%s\x1b[0m",
        `WARNING: ${current} is listed in .env.sample, but does not have a value assigned!`
      );
    }

    return {
      ...prev,
      [current]: process.env[current],
    };
  }, {});

  // This assigns the collected whitelisted environment variables to Vite's replacement object
  const define = {
    "process.env": {
      ...env,
    },
  };

  return defineConfig({
    define,
    plugins: [remix({ presets: [vercelPreset()] }), tsconfigPaths()],
  });
};
