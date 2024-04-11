import { LoaderFunction } from "@netlify/remix-runtime";
import { getAircraftImageURL } from "~/utils/api/airport-data";
import { RESPONSE_ERROR, ResponseError } from "~/utils/errors/response";
import { ONE_WEEK } from "~/utils/helpers/date";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { searchParams } = new URL(request.url);
  const registration = searchParams.get("registration") ?? undefined;

  const hex = params.hex as string;

  try {
    const url = await getAircraftImageURL(hex, registration);

    return new Response(url, {
      status: 200,
      headers: [
        // TODO: add caching strategy per provider
        //
        // ["Netlify-Vary", "query=thumbnail"],
        // [
        //   "Netlify-CDN-Cache-Control",
        //   `public, max-age=0, stale-while-revalidate=${Math.floor(
        //     ONE_YEAR / 1000
        //   )}`,
        // ],
        [
          "Cache-Control",
          `public, max-age=${Math.floor(
            ONE_WEEK / 1000
          )}, s-maxage=${Math.floor(ONE_WEEK / 1000)}, must-revalidate`,
        ],
      ],
    });
  } catch (e) {
    console.error(e);

    if ((e as ResponseError).name === RESPONSE_ERROR) {
      return new Response((e as ResponseError).message, {
        status: (e as ResponseError).status,
      });
    }
    return new Response(`Failed to retrieve an image for aircraft "${hex}".`, {
      status: 500,
    });
  }
};
