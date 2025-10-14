import Image from "next/image";
import Link from "next/link";

import type { Maybe, SanityImageProps } from "@/types";

import { SanityImage } from "./elements/sanity-image";

const LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

interface LogoProps {
  src?: Maybe<string>;
  image?: Maybe<SanityImageProps>;
  alt?: Maybe<string>;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function Logo({
  src,
  alt = "logo",
  image,
  width = 170,
  height = 40,
  priority = true,
  className = "h-8 w-auto max-h-[80px]", // Default responsive class
}: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      {image ? (
        <SanityImage
          image={image}
          alt={alt ?? "logo"}
          className={className}
          loading="eager"
          decoding="sync"
        />
      ) : (
        <Image
          src={src ?? LOGO_URL}
          alt={alt ?? "logo"}
          width={width}
          height={height}
          className={className}
          loading="eager"
          priority={priority}
          decoding="sync"
        />
      )}
    </Link>
  );
}
