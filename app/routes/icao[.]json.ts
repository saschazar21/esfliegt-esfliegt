import { LoaderFunction, json } from "@vercel/remix";
import icao from "~/assets/icao.json";

export const loader: LoaderFunction = () => json(icao);
