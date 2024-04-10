import { LoaderFunction } from "@remix-run/node";
import { getAirport } from "~/utils/api/hexdb";
import { RESPONSE_ERROR, ResponseError } from "~/utils/errors/response";
import { ONE_YEAR } from "~/utils/helpers/date";

export const loader: LoaderFunction = async ({ params }) => {
  const code = params.code as string;

  try {
    const data = await getAirport(code);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: [
        ["content-type", "application/json"],
        // TODO: add caching strategy per provider
        //
        // ["Netlify-Vary", "query"],
        // [
        //   "Netlify-CDN-Cache-Control",
        //   `public, max-age=0, stale-while-revalidate=${Math.floor(
        //     ONE_YEAR / 1000
        //   )}`,
        // ],
        [
          "Cache-Control",
          `public, max-age=${Math.floor(
            ONE_YEAR / 1000
          )}, s-maxage=${Math.floor(ONE_YEAR / 1000)}, must-revalidate`,
        ],
      ],
    });
  } catch (e) {
    console.error(e);

    const error = {
      error:
        (e as ResponseError).name === RESPONSE_ERROR
          ? (e as ResponseError).message
          : `Error while fetching data for airport "${code}".`,
    };

    return new Response(JSON.stringify(error), {
      status:
        (e as ResponseError).name === RESPONSE_ERROR
          ? (e as ResponseError).status
          : 500,
      headers: { "content-type": "application/json" },
    });
  }
};
