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
  screenshots: [
    {
      src: "/screenshots/screen_desktop_1_dark.jpg",
      sizes: "1066x600",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Index page on desktop in dark mode",
    },
    {
      src: "/screenshots/screen_desktop_1_light.jpg",
      sizes: "1066x600",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Index page on desktop in light mode",
    },
    {
      src: "/screenshots/screen_mobile_1_dark.jpg",
      sizes: "337x600",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Index page on mobile without route data in dark mode",
    },
    {
      src: "/screenshots/screen_mobile_1_light.jpg",
      sizes: "337x600",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Index page on mobile without route data in light mode",
    },
    {
      src: "/screenshots/screen_mobile_2_dark.jpg",
      sizes: "337x600",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Index page on mobile with route data in dark mode",
    },
    {
      src: "/screenshots/screen_mobile_2_light.jpg",
      sizes: "337x600",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Index page on mobile with route data in light mode",
    },
    {
      src: "/screenshots/screen_mobile_3_dark.jpg",
      sizes: "337x600",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Index page on mobile with aircraft data in dark mode",
    },
    {
      src: "/screenshots/screen_mobile_3_light.jpg",
      sizes: "337x600",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Index page on mobile with aircraft data in light mode",
    },
  ],
};

export const loader: LoaderFunction = () => json(manifest);
