import { LoaderFunction, json } from "@remix-run/node";
import icao from "~/assets/icao.json";

export const loader: LoaderFunction = () => json(icao);
