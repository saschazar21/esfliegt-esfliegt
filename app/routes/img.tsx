import { LoaderFunction } from "@netlify/remix-runtime";
import { RESPONSE_ERROR, ResponseError } from "~/utils/errors/response";
import { ONE_YEAR } from "~/utils/helpers/date";
import { BASE_URL } from "~/utils/helpers/image";

const IMAGEKIT_ID = process.env.IMAGEKIT_ID;

const ALLOWED_HOSTNAMES = ["cdn.jetphotos.com", "cdn.airport-data.com"];

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const userAgent = request.headers.get("user-agent");

  const { src, ...rest } = Object.fromEntries(searchParams);

  const transformations = rest
    ? Object.keys(rest)
        .map((key) => `${key}-${rest[key]}`)
        .join(",")
    : null;

  const tr = transformations ? `/tr:${transformations}` : "";

  const url = new URL(`/${IMAGEKIT_ID}${tr}/${src}`, BASE_URL);

  try {
    try {
      const u = new URL(src);

      if (!ALLOWED_HOSTNAMES.find((hostname) => hostname === u.hostname)) {
        throw new ResponseError(
          `${u.hostname} is not whitelisted for this operation.`,
          400
        );
      }
    } catch (e) {
      throw (e as ResponseError).name === RESPONSE_ERROR
        ? e
        : new ResponseError(
            `Malformatted image source: "${src}", must be a valid URL.`,
            400
          );
    }

    const res = await fetch(url, {
      headers: [["user-agent", userAgent as string]],
    });

    if (res.status !== 200) {
      throw new ResponseError(
        `Error while fetching image "${src}".`,
        res.status
      );
    }

    const headers = res.headers;

    const blob = await res.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        ...headers,
        "Netlify-Vary": "query",
        "Netlify-CDN-Cache-Control": `public, max-age=0, stale-while-revalidate=${Math.floor(
          ONE_YEAR / 1000
        )}`,
        "Cache-Control": `public, max-age=${Math.floor(
          ONE_YEAR / 1000
        )}, s-maxage=${Math.floor(ONE_YEAR / 1000)}, must-revalidate`,
      },
    });
  } catch (e) {
    console.error(e);

    const error =
      (e as ResponseError).name === RESPONSE_ERROR
        ? (e as ResponseError).message
        : `Error while fetching image "${src}".`;

    return new Response(error, {
      status:
        (e as ResponseError).name === RESPONSE_ERROR
          ? (e as ResponseError).status
          : 500,
    });
  }
};
