import type { PortableTextBlock } from "next-sanity";
import slugify from "slugify";

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const getBaseUrl = () => {
  // Always use the production domain in production environment
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.flyballhub.com";
  }
  // Use the preview URL for preview deployments
  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development
  return "http://localhost:3000";
};

export const isRelativeUrl = (url: string) =>
  url.startsWith("/") || url.startsWith("#") || url.startsWith("?");

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.log(e);
    return isRelativeUrl(url);
  }
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getTitleCase = (name: string) => {
  const titleTemp = name.replace(/([A-Z])/g, " $1");
  return titleTemp.charAt(0).toUpperCase() + titleTemp.slice(1);
};

type Response<T> = [T, undefined] | [undefined, string];

export async function handleErrors<T>(
  promise: Promise<T>,
): Promise<Response<T>> {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (err) {
    return [
      undefined,
      err instanceof Error ? err.message : JSON.stringify(err),
    ];
  }
}

export function convertToSlug(
  text?: string,
  { fallback }: { fallback?: string } = { fallback: "top-level" },
) {
  if (!text) return fallback;
  return slugify(text.trim(), {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
  });
}

export function parseChildrenToSlug(children: PortableTextBlock["children"]) {
  if (!children) return "";
  return convertToSlug(children.map((child) => child.text).join(""));
}

/**
 * Strip zero-width characters that can come from Sanity/PortableText
 * These break rendering and show up as HTML entities like &ZeroWidthSpace;
 */
export const cleanText = (text: string | undefined | null): string =>
  text?.replace(/[\u200B\u200C\u200D\uFEFF\u2060\u180E]/g, "") ?? "";

const ZERO_WIDTH_RE = /[\u200B\u200C\u200D\uFEFF\u2060\u180E]/g;

/**
 * Recursively strip zero-width characters from every string in any data structure.
 * Used at the fetch layer to clean all Sanity data before it reaches components.
 */
export function deepCleanStrings<T>(data: T): T {
  if (typeof data === "string") {
    return data.replace(ZERO_WIDTH_RE, "") as T;
  }
  if (Array.isArray(data)) {
    return data.map(deepCleanStrings) as T;
  }
  if (data !== null && typeof data === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = deepCleanStrings(value);
    }
    return cleaned as T;
  }
  return data;
}
