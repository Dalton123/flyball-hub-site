#!/usr/bin/env node

const USER_AGENT = "Twitterbot/1.0";
const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 630;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

const DEFAULT_URLS = [
  "https://www.flyballhub.com/",
  "https://www.flyballhub.com/blog/how-we-plan-a-flyball-training-session-and-keep-it-calm",
  "https://www.flyballhub.com/features",
  "https://www.flyballhub.com/breeds/whippet",
];

const urls = process.argv.slice(2).filter((value) => value && value !== "--");
const targetUrls = urls.length > 0 ? urls : DEFAULT_URLS;

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function parseAttributes(tag) {
  const attributes = new Map();
  const attributePattern = /([:\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;

  while ((match = attributePattern.exec(tag)) !== null) {
    const [, rawName, , doubleQuoted, singleQuoted, unquoted] = match;
    attributes.set(
      rawName.toLowerCase(),
      decodeHtml(doubleQuoted ?? singleQuoted ?? unquoted ?? ""),
    );
  }

  return attributes;
}

function collectMeta(html) {
  const meta = new Map();
  const tagPattern = /<meta\b[^>]*>/gi;
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    const attributes = parseAttributes(match[0]);
    const key = attributes.get("property") ?? attributes.get("name");
    const content = attributes.get("content");

    if (key && content) {
      const normalizedKey = key.toLowerCase();
      if (!meta.has(normalizedKey)) {
        meta.set(normalizedKey, []);
      }
      meta.get(normalizedKey).push(content);
    }
  }

  return meta;
}

function firstMeta(meta, key) {
  return meta.get(key)?.[0] ?? null;
}

function absoluteUrl(value, baseUrl) {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function readPngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a" || buffer.length < 24) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    format: "png",
  };
}

function readJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame && offset + 8 < buffer.length) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
        format: "jpeg",
      };
    }

    offset += 2 + length;
  }

  return null;
}

function readImageDimensions(buffer) {
  return readPngDimensions(buffer) ?? readJpegDimensions(buffer);
}

async function fetchWithTwitterbot(url) {
  return fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": USER_AGENT,
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8",
    },
  });
}

async function verifyImage(imageUrl) {
  const errors = [];
  const response = await fetchWithTwitterbot(imageUrl);
  const contentType =
    response.headers.get("content-type")?.split(";")[0]?.toLowerCase() ?? "";
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dimensions = readImageDimensions(buffer);

  if (response.status !== 200) {
    errors.push(`image returned HTTP ${response.status}`);
  }

  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    errors.push(
      `image content-type is ${contentType || "missing"}, expected image/jpeg or image/png`,
    );
  }

  if (!dimensions) {
    errors.push("could not read image dimensions from JPEG/PNG header");
  } else if (
    dimensions.width !== EXPECTED_WIDTH ||
    dimensions.height !== EXPECTED_HEIGHT
  ) {
    errors.push(
      `image dimensions are ${dimensions.width}x${dimensions.height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`,
    );
  }

  return {
    url: imageUrl,
    status: response.status,
    contentType,
    bytes: buffer.length,
    dimensions,
    errors,
  };
}

async function verifyPage(pageUrl) {
  const errors = [];
  const warnings = [];
  const response = await fetchWithTwitterbot(pageUrl);
  const finalUrl = response.url;
  const contentType =
    response.headers.get("content-type")?.split(";")[0]?.toLowerCase() ?? "";
  const html = await response.text();
  const meta = collectMeta(html);

  if (response.status !== 200) {
    errors.push(`page returned HTTP ${response.status}`);
  }

  if (!contentType.includes("html")) {
    errors.push(
      `page content-type is ${contentType || "missing"}, expected HTML`,
    );
  }

  const twitterCard = firstMeta(meta, "twitter:card");
  const twitterImageRaw = firstMeta(meta, "twitter:image");
  const ogImageRaw = firstMeta(meta, "og:image");
  const ogWidth = firstMeta(meta, "og:image:width");
  const ogHeight = firstMeta(meta, "og:image:height");
  const twitterImage = twitterImageRaw
    ? absoluteUrl(twitterImageRaw, finalUrl)
    : null;
  const ogImage = ogImageRaw ? absoluteUrl(ogImageRaw, finalUrl) : null;

  if (twitterCard !== "summary_large_image") {
    errors.push(
      `twitter:card is ${twitterCard ?? "missing"}, expected summary_large_image`,
    );
  }

  if (!twitterImage) {
    errors.push("twitter:image is missing or invalid");
  }

  if (!ogImage) {
    errors.push("og:image is missing or invalid");
  }

  if (ogWidth && ogWidth !== String(EXPECTED_WIDTH)) {
    warnings.push(`og:image:width is ${ogWidth}, expected ${EXPECTED_WIDTH}`);
  }

  if (ogHeight && ogHeight !== String(EXPECTED_HEIGHT)) {
    warnings.push(
      `og:image:height is ${ogHeight}, expected ${EXPECTED_HEIGHT}`,
    );
  }

  if (twitterImage && ogImage && twitterImage !== ogImage) {
    warnings.push(
      "twitter:image and og:image differ; both will be fetched and validated",
    );
  }

  const imageUrls = [...new Set([twitterImage, ogImage].filter(Boolean))];
  const images = [];
  for (const imageUrl of imageUrls) {
    const imageResult = await verifyImage(imageUrl);
    images.push(imageResult);
    errors.push(...imageResult.errors.map((error) => `${imageUrl}: ${error}`));
  }

  return {
    pageUrl,
    finalUrl,
    status: response.status,
    contentType,
    twitterCard,
    twitterImage,
    ogImage,
    ogWidth,
    ogHeight,
    images,
    warnings,
    errors,
  };
}

function printResult(result) {
  const icon = result.errors.length > 0 ? "FAIL" : "PASS";
  console.log(`${icon} ${result.pageUrl}`);
  console.log(
    `  page: ${result.status} ${result.contentType} -> ${result.finalUrl}`,
  );
  console.log(`  twitter:card: ${result.twitterCard ?? "missing"}`);
  console.log(`  twitter:image: ${result.twitterImage ?? "missing"}`);
  console.log(`  og:image: ${result.ogImage ?? "missing"}`);
  console.log(
    `  og:image dimensions meta: ${result.ogWidth ?? "missing"}x${result.ogHeight ?? "missing"}`,
  );

  for (const image of result.images) {
    const dimensions = image.dimensions
      ? `${image.dimensions.width}x${image.dimensions.height} ${image.dimensions.format}`
      : "unknown";
    console.log(
      `  image: ${image.status} ${image.contentType || "missing"} ${dimensions} ${image.bytes} bytes`,
    );
    console.log(`         ${image.url}`);
  }

  for (const warning of result.warnings) {
    console.log(`  WARN ${warning}`);
  }

  for (const error of result.errors) {
    console.log(`  ERROR ${error}`);
  }
}

const results = [];
for (const url of targetUrls) {
  try {
    const result = await verifyPage(url);
    results.push(result);
    printResult(result);
  } catch (error) {
    const result = {
      pageUrl: url,
      finalUrl: url,
      status: 0,
      contentType: "",
      twitterCard: null,
      twitterImage: null,
      ogImage: null,
      ogWidth: null,
      ogHeight: null,
      images: [],
      warnings: [],
      errors: [error instanceof Error ? error.message : String(error)],
    };
    results.push(result);
    printResult(result);
  }
  console.log("");
}

const failed = results.filter((result) => result.errors.length > 0);
if (failed.length > 0) {
  console.error(
    `Social preview verification failed for ${failed.length}/${results.length} URL(s).`,
  );
  process.exit(1);
}

console.log(
  `Social preview verification passed for ${results.length}/${results.length} URL(s).`,
);
console.log(
  "Crawler cache caveat: X/Twitter and other platforms can keep stale failed scrapes. If a deployed fix is correct but a card still renders without an image, share a URL or image URL with a harmless version query string to force a fresh scrape.",
);
