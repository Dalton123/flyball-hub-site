import { defineLive } from "next-sanity";

import { client } from "./client";
import { token } from "./token";
import { deepCleanStrings } from "@/utils";

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

const { sanityFetch: _sanityFetch, SanityLive } = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: token,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: token,
});

export const sanityFetch: typeof _sanityFetch = async (...args) => {
  const result = await _sanityFetch(...args);
  return { ...result, data: deepCleanStrings(result.data) };
};

export { SanityLive };
