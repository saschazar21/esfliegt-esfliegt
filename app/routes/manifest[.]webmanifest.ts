import { LoaderFunction, json } from "@remix-run/node";

import pkg from "../../package.json";

const manifest = {
  id: "/?utm_source=pwa",
  name: pkg.long_name,
  short_name: pkg.short_name,
  start_url: "/?utm_source=pwa",
  lang: "en",
  scope: "/",
  theme_color: pkg.color,
  background_color: "#aabec5",
  display_override: ["standalone", "minimal-ui", "browser"],
  display: "standalone",
  orientation: "portrait-primary",
  icons: [
    {
      src: "/icons/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/icons/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/icons/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ],
  screenshots: [],
};

export const loader: LoaderFunction = () => json(manifest);
