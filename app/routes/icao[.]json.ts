import { LoaderFunction, json } from "@netlify/remix-runtime";
import icao from "~/assets/icao.json";
import { ONE_YEAR } from "~/utils/helpers/date";

export const loader: LoaderFunction = () =>
  json(icao, {
    status: 200,
    headers: [
      ["content-type", "application/json"],
      [
        "Cache-Control",
        `public, max-age=${Math.floor(ONE_YEAR / 1000)}, s-maxage=${Math.floor(
          ONE_YEAR / 1000
        )}, must-revalidate`,
      ],
    ],
  });
