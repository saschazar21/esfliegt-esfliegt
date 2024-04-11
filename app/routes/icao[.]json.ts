import { LoaderFunction, json } from "@netlify/remix-runtime";
import icao from "~/assets/icao.json";

export const loader: LoaderFunction = () => json(icao);
