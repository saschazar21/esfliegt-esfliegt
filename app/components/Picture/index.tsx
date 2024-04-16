import { FC, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "clsx";
import { Loading } from "~/components/Loading";
import { ImageKitTransformationOptions } from "~/utils/helpers/image";

import styles from "./Picture.module.css";

export type ImageFormat = "avif" | "jpeg" | "webp";

export interface PictureProps extends ImageKitTransformationOptions {
  alt: string;
  className?: string;
  h: number;
  sizes: string;
  src: string;
  w: number;
  widths: number[];
}

export const DEFAULT_OPTIONS: ImageKitTransformationOptions = {
  // ar: "4-3",
  bg: "blurred",
  c: "at_max",
  cm: "pad_resize",
  di: "paper-plane.jpg",
  f: "auto",
  fo: "auto",
  q: 75,
};

const buildImageLink = (params: URLSearchParams) => {
  const path = "/img";

  return `${path}?${params.toString()}`;
};

export const Picture: FC<PictureProps> = ({
  alt,
  className,
  h,
  sizes,
  w,
  widths,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [rest.src]);

  const ratio = useMemo(() => w / h, [w, h]);

  const handleOnLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const params = useCallback(
    (f: ImageFormat, w?: number, h?: number) =>
      new URLSearchParams({
        ...DEFAULT_OPTIONS,
        ...rest,
        ...(w ? { w: w.toString(), h: Math.floor(w / ratio).toString() } : {}),
        ...(h ? { h: h.toString() } : {}),
        ...(rest.q ? { q: rest.q.toString() } : {}),
        f,
      } as Record<string, string>),
    [ratio, rest]
  );

  const srcSet = useCallback(
    (format: ImageFormat) =>
      widths
        .map((w) => [buildImageLink(params(format, w)), `${w}w`].join(" "))
        .join(", "),
    [params, widths]
  );

  const sources = useMemo(
    () =>
      ["avif", "webp", "jpeg"].map((format) => (
        <source
          key={format}
          sizes={sizes}
          srcSet={srcSet(format as ImageFormat)}
          type={`image/${format}`}
        />
      )),
    [sizes, srcSet]
  );

  const img = useMemo(
    () => (
      <img
        data-loading={isLoading ? isLoading : null}
        alt={alt}
        className={className}
        height={h}
        onLoad={handleOnLoad}
        width={w}
        src={buildImageLink(params("jpeg", w, h))}
      />
    ),
    [alt, className, h, handleOnLoad, isLoading, params, w]
  );

  const loading = classNames(styles.loading, className);

  return (
    <div className={styles.container}>
      <picture>
        {sources}
        {img}
      </picture>
      {isLoading ? <Loading className={loading} /> : null}
    </div>
  );
};
