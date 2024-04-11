export interface ImageKitTransformationOptions {
  ar?: string; // e.g. 4-3
  bg?: string;
  c?: "at_max" | "maintain_ratio";
  cm?: "extract" | "pad_resize";
  di?: string;
  f?: "auto" | "jpg" | "jpeg" | "webp" | "avif" | "png";
  fo?: "auto";
  h?: number;
  q?: number;
  w?: number;
}

export const BASE_URL = "https://ik.imagekit.io";
