import { LoaderFunction, json } from "@remix-run/cloudflare";
import { scanAircraft } from "~/utils/api";
import { ResponseError } from "~/utils/errors/response";
import { Point } from "~/utils/helpers/geo";

export const loader: LoaderFunction = async ({ context, request }) => {
  const { env } = context.cloudflare;
  const url = new URL(request.url);

  const [latitude, longitude] = [
    url.searchParams.get("latitude"),
    url.searchParams.get("longitude"),
  ];

  try {
    if (!latitude || !longitude) {
      throw new ResponseError(
        "latitude and/or longitude param is missing.",
        400
      );
    }

    const location: Point = [parseFloat(latitude), parseFloat(longitude)];

    const aircraft = await scanAircraft(env.CF_PAGES_URL, location);

    return json({ data: aircraft });
  } catch (e) {
    console.error(e);

    throw json(
      { error: (e as Error).message },
      { status: (e as ResponseError).status ?? 500 }
    );
  }
};
