import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { AircraftContextProvider } from "~/contexts/AircraftContext";
import { PositionContextProvider } from "~/contexts/PositionContext";

import "~/styles/_typography.css";
import "~/styles/_base.css";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <Meta />
        <Links />
      </head>
      <body>
        <PositionContextProvider>
          <AircraftContextProvider>
            <Outlet />
          </AircraftContextProvider>
        </PositionContextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
