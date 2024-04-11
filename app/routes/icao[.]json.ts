import { LoaderFunction, json } from "@remix-run/cloudflare";
import icao from "~/assets/icao.json";

export const loader: LoaderFunction = () => json(icao);
