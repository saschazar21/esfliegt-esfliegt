import { LoaderFunction, json } from "@vercel/remix";
import { scanAircraft } from "~/utils/api";
import { ResponseError } from "~/utils/errors/response";
import { Point } from "~/utils/helpers/geo";

export const loader: LoaderFunction = async ({ request }) => {
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

    const aircraft = await scanAircraft(location);

    return json({ data: aircraft });
  } catch (e) {
    console.error(e);

    throw json(
      { error: (e as Error).message },
      { status: (e as ResponseError).status ?? 500 }
    );
  }
};
