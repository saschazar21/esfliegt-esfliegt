import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "~/components/Footer";
import { AircraftContextProvider } from "~/contexts/AircraftContext";
import { PositionContextProvider } from "~/contexts/PositionContext";

import pkg from "../package.json";

import "~/styles/_typography.css";
import "~/styles/_base.css";

export const meta: MetaFunction = () => [
  { title: pkg.long_name },
  { name: "description", content: pkg.description },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="preload"
          href="/fonts/Poppins-Light.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Poppins-SemiBold.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/RedditMono-Light.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://esm.sh/gardevoir@1.0.0/dist/index.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://esm.sh/gardevoir@1.0.0/dist/index.min.css"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          content={pkg.color}
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content={pkg.color} />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="theme-color" content={pkg.color} />

        <Meta />
        <Links />
      </head>
      <body>
        <PositionContextProvider>
          <AircraftContextProvider>
            <Outlet />
          </AircraftContextProvider>
        </PositionContextProvider>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}
