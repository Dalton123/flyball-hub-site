/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import type { ImageResponseOptions } from "next/server";

import type { Maybe } from "@/types";

import { getOgMetaData } from "./og-config";
import {
  getBlogPageOGData,
  getGenericPageOGData,
  getHomePageOGData,
  getSlugPageOGData,
} from "./og-data";

export const runtime = "edge";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const brand = {
  forest: "#123329",
  forestDark: "#071f19",
  cream: "#fbf2d6",
  creamSoft: "#fff8e8",
  lime: "#c5ef38",
  teal: "#4dd1a1",
  white: "#fffdf5",
};

const fallbackContent = {
  title: "Flyball Hub",
  description: "Find teams, learn the sport, and manage your flyball club.",
  blogEyebrow: "FLYBALL GUIDE",
  pageEyebrow: "LEARN FLYBALL",
  genericEyebrow: "FLYBALL HUB",
};

type SeoImageRenderProps = {
  seoImage: string;
};

type ContentProps = Record<string, string>;

type OgContentType = "blog" | "page" | "generic";

type BrandedOgRenderProps = {
  image?: Maybe<string>;
  title?: Maybe<string>;
  logo?: Maybe<string>;
  description?: Maybe<string>;
  variant: OgContentType;
};

const seoImageRender = ({ seoImage }: SeoImageRenderProps) => {
  return (
    <div tw="flex flex-col w-full h-full items-center justify-center">
      <img
        src={seoImage}
        alt="SEO preview"
        width={OG_WIDTH}
        height={OG_HEIGHT}
      />
    </div>
  );
};

const getEyebrow = (variant: OgContentType) => {
  if (variant === "blog") return fallbackContent.blogEyebrow;
  if (variant === "page") return fallbackContent.pageEyebrow;
  return fallbackContent.genericEyebrow;
};

const cleanText = (value: Maybe<string>, fallback: string) => {
  const text = value?.trim();
  return text ? text : fallback;
};

const cleanHeadline = (value: Maybe<string>) => {
  return cleanText(value, fallbackContent.title).replace(
    /\s+\|\s+Flyball Hub$/i,
    "",
  );
};

const getHeadlineFontSize = (headline: string) => {
  if (headline.length > 92) return 44;
  if (headline.length > 72) return 50;
  if (headline.length > 56) return 56;
  return 66;
};

const clampDescription = (value: string) => {
  if (value.length <= 112) return value;
  return `${value.slice(0, 109).trim()}...`;
};

const PawPattern = () => (
  <svg
    width={OG_WIDTH}
    height={OG_HEIGHT}
    viewBox={`0 0 ${OG_WIDTH} ${OG_HEIGHT}`}
    style={{ position: "absolute", inset: 0 }}
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="paw-grid"
        width="140"
        height="140"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="28" cy="26" r="6" fill={brand.cream} opacity="0.12" />
        <circle cx="46" cy="22" r="6" fill={brand.cream} opacity="0.12" />
        <circle cx="62" cy="32" r="6" fill={brand.cream} opacity="0.12" />
        <ellipse
          cx="46"
          cy="54"
          rx="18"
          ry="14"
          fill={brand.cream}
          opacity="0.1"
        />
        <circle
          cx="104"
          cy="92"
          r="18"
          fill="none"
          stroke={brand.lime}
          strokeWidth="3"
          opacity="0.11"
        />
        <path
          d="M88 92h32"
          stroke={brand.lime}
          strokeWidth="3"
          opacity="0.11"
        />
      </pattern>
      <linearGradient id="card-glow" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor={brand.forest} />
        <stop offset="100%" stopColor={brand.forestDark} />
      </linearGradient>
    </defs>
    <rect width={OG_WIDTH} height={OG_HEIGHT} fill="url(#card-glow)" />
    <rect width={OG_WIDTH} height={OG_HEIGHT} fill="url(#paw-grid)" />
    <circle cx="1030" cy="110" r="210" fill={brand.lime} opacity="0.18" />
    <circle cx="1125" cy="510" r="160" fill={brand.teal} opacity="0.12" />
    <circle cx="125" cy="560" r="190" fill={brand.cream} opacity="0.08" />
  </svg>
);

const LogoLockup = ({ logo }: { logo?: Maybe<string> }) => (
  <div tw="flex items-center">
    <div
      tw="flex items-center justify-center rounded-2xl"
      style={{
        width: 64,
        height: 64,
        backgroundColor: brand.cream,
        border: `2px solid ${brand.lime}`,
      }}
    >
      {logo ? (
        <img src={logo} alt="Flyball Hub logo" width={48} height={48} />
      ) : (
        <div
          tw="flex items-center justify-center font-bold"
          style={{ color: brand.forest, fontSize: 28 }}
        >
          FH
        </div>
      )}
    </div>
    <div tw="flex flex-col ml-4">
      <div tw="flex font-bold" style={{ color: brand.cream, fontSize: 30 }}>
        Flyball Hub
      </div>
      <div tw="flex" style={{ color: "rgba(251,242,214,0.72)", fontSize: 18 }}>
        Train. Race. Rally the team.
      </div>
    </div>
  </div>
);

const BrandedFallbackArt = ({ logo }: { logo?: Maybe<string> }) => (
  <div
    tw="flex w-full h-full items-center justify-center relative overflow-hidden"
    style={{ backgroundColor: brand.cream }}
  >
    <svg
      width="450"
      height="450"
      viewBox="0 0 450 450"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <circle cx="225" cy="225" r="170" fill={brand.lime} opacity="0.9" />
      <path
        d="M75 225h300"
        stroke={brand.forest}
        strokeWidth="16"
        opacity="0.28"
      />
      <path
        d="M225 55v340"
        stroke={brand.forest}
        strokeWidth="16"
        opacity="0.22"
      />
      <circle
        cx="225"
        cy="225"
        r="112"
        fill="none"
        stroke={brand.forest}
        strokeWidth="18"
        opacity="0.32"
      />
      <circle cx="142" cy="138" r="16" fill={brand.forest} opacity="0.65" />
      <circle cx="194" cy="116" r="16" fill={brand.forest} opacity="0.65" />
      <circle cx="250" cy="120" r="16" fill={brand.forest} opacity="0.65" />
      <ellipse
        cx="205"
        cy="190"
        rx="54"
        ry="40"
        fill={brand.forest}
        opacity="0.6"
      />
    </svg>
    <div
      tw="flex items-center justify-center rounded-3xl"
      style={{
        width: 178,
        height: 178,
        backgroundColor: brand.creamSoft,
        border: `4px solid ${brand.forest}`,
        boxShadow: "0 28px 70px rgba(7,31,25,0.22)",
      }}
    >
      {logo ? (
        <img src={logo} alt="Flyball Hub logo" width={130} height={130} />
      ) : (
        <div
          tw="flex font-bold"
          style={{ color: brand.forest, fontSize: 68, letterSpacing: -3 }}
        >
          FH
        </div>
      )}
    </div>
  </div>
);

const VisualPanel = ({
  image,
  logo,
  variant,
}: {
  image?: Maybe<string>;
  logo?: Maybe<string>;
  variant: OgContentType;
}) => (
  <div
    tw="flex relative items-center justify-center overflow-hidden"
    style={{
      width: 430,
      height: 430,
      borderRadius: 44,
      backgroundColor: brand.cream,
      border: `10px solid ${brand.creamSoft}`,
      boxShadow: "0 34px 95px rgba(0,0,0,0.28)",
    }}
  >
    {image ? (
      <img
        src={image}
        width={430}
        height={430}
        alt={`${variant} preview`}
        tw="w-full h-full"
        style={{ objectFit: "cover" }}
      />
    ) : (
      <BrandedFallbackArt logo={logo} />
    )}
    <div
      tw="flex absolute bottom-6 left-6 right-6 items-center justify-between rounded-2xl px-5 py-4"
      style={{
        backgroundColor: "rgba(251,242,214,0.92)",
        color: brand.forest,
      }}
    >
      <div tw="flex font-bold" style={{ fontSize: 22 }}>
        Built for flyball people
      </div>
      <div
        tw="flex rounded-full"
        style={{ width: 54, height: 16, backgroundColor: brand.lime }}
      />
    </div>
  </div>
);

const brandedOgImageRender = ({
  image,
  title,
  logo,
  description,
  variant,
}: BrandedOgRenderProps) => {
  const headline = cleanHeadline(title);
  const body = clampDescription(
    cleanText(description, fallbackContent.description),
  );
  const eyebrow = getEyebrow(variant);
  const showDescription = headline.length <= 52;

  return (
    <div
      tw="flex w-full h-full relative overflow-hidden"
      style={{ fontFamily: "Inter" }}
    >
      <PawPattern />
      <div tw="flex w-full h-full relative p-12">
        <div tw="flex flex-col justify-between" style={{ width: 660 }}>
          <LogoLockup logo={logo} />

          <div tw="flex flex-col">
            <div
              tw="flex self-start rounded-full px-5 py-3 font-bold tracking-widest"
              style={{
                backgroundColor: brand.lime,
                color: brand.forest,
                fontSize: 21,
                letterSpacing: 2.4,
              }}
            >
              {eyebrow}
            </div>
            <h1
              tw="flex font-bold leading-none my-7"
              style={{
                color: brand.white,
                fontSize: getHeadlineFontSize(headline),
                letterSpacing: -2.4,
                maxWidth: 640,
              }}
            >
              {headline}
            </h1>
            {showDescription && (
              <p
                tw="flex leading-snug m-0"
                style={{
                  color: "rgba(251,242,214,0.84)",
                  fontSize: 28,
                  maxWidth: 600,
                }}
              >
                {body}
              </p>
            )}
          </div>

          <div tw="flex items-center">
            <div
              tw="flex rounded-full mr-4"
              style={{ width: 86, height: 10, backgroundColor: brand.lime }}
            />
            <div
              tw="flex"
              style={{ color: "rgba(251,242,214,0.74)", fontSize: 22 }}
            >
              flyballhub.com
            </div>
          </div>
        </div>

        <div tw="flex flex-1 items-center justify-center pl-8">
          <VisualPanel image={image} logo={logo} variant={variant} />
        </div>
      </div>
    </div>
  );
};

async function getTtfFont(
  family: string,
  axes: string[],
  value: number[],
): Promise<ArrayBuffer> {
  const familyParam = `${axes.join(",")}@${value.join(",")}`;

  // Get css style sheet with user agent Mozilla/5.0 Firefox/1.0 to ensure non-variable TTF is returned
  const cssCall = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:${familyParam}&display=swap`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 Firefox/1.0",
      },
    },
  );

  const css = await cssCall.text();
  const ttfUrl = css.match(/url\(([^)]+)\)/)?.[1];

  if (!ttfUrl) {
    throw new Error("Failed to extract font URL from CSS");
  }

  return await fetch(ttfUrl).then((res) => res.arrayBuffer());
}

const getOptions = async ({
  width,
  height,
}: {
  width: number;
  height: number;
}): Promise<ImageResponseOptions> => {
  const [interRegular, interBold] = await Promise.all([
    getTtfFont("Inter", ["wght"], [400]),
    getTtfFont("Inter", ["wght"], [700]),
  ]);
  return {
    width,
    height,
    fonts: [
      {
        name: "Inter",
        data: interRegular,
        style: "normal",
        weight: 400,
      },
      {
        name: "Inter",
        data: interBold,
        style: "normal",
        weight: 700,
      },
    ],
  };
};

const getHomePageContent = async ({ id }: ContentProps) => {
  if (!id) return brandedOgImageRender({ variant: "generic" });
  const [result, err] = await getHomePageOGData(id);
  if (err || !result) return brandedOgImageRender({ variant: "generic" });
  if (result?.seoImage) return seoImageRender({ seoImage: result.seoImage });
  return brandedOgImageRender({ ...result, variant: "generic" });
};

const getSlugPageContent = async ({ id }: ContentProps) => {
  if (!id) return brandedOgImageRender({ variant: "page" });
  const [result, err] = await getSlugPageOGData(id);
  if (err || !result) return brandedOgImageRender({ variant: "page" });
  return brandedOgImageRender({ ...result, variant: "page" });
};

const getBlogPageContent = async ({ id }: ContentProps) => {
  if (!id) return brandedOgImageRender({ variant: "blog" });
  const [result, err] = await getBlogPageOGData(id);
  if (err || !result) return brandedOgImageRender({ variant: "blog" });
  return brandedOgImageRender({ ...result, variant: "blog" });
};

const getGenericPageContent = async ({ id }: ContentProps) => {
  if (!id) return brandedOgImageRender({ variant: "generic" });
  const [result, err] = await getGenericPageOGData(id);
  if (err || !result) return brandedOgImageRender({ variant: "generic" });
  return brandedOgImageRender({ ...result, variant: "generic" });
};

const block = {
  homePage: getHomePageContent,
  page: getSlugPageContent,
  blog: getBlogPageContent,
} as const;

export async function GET({ url }: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(url);
  const type = searchParams.get("type") as keyof typeof block;
  const { width, height } = getOgMetaData(searchParams);
  const para = Object.fromEntries(searchParams.entries());
  const options = await getOptions({ width, height });
  const image = block[type] ?? getGenericPageContent;

  try {
    const content = await image(para);
    return new ImageResponse(content, options);
  } catch (err) {
    console.log({ err });
    return new ImageResponse(
      brandedOgImageRender({ variant: "generic" }),
      options,
    );
  }
}
