import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { buildDynamicSitemapEntries } from "../src/app/sitemap-entries";

const baseUrl = "https://www.flyballhub.com";

test("uses the current Sanity update timestamp for blog lastmod", () => {
  const updatedAt = "2026-06-04T19:29:11Z";

  const entries = buildDynamicSitemapEntries(
    {
      slugPages: [],
      blogPages: [
        { slug: "/blog/dog-recall-training", lastModified: updatedAt },
      ],
      breedPages: [],
    },
    baseUrl,
  );

  assert.equal(entries.length, 1);
  assert.equal(entries[0]?.url, `${baseUrl}/blog/dog-recall-training`);
  assert.ok(entries[0]?.lastModified instanceof Date);
  assert.equal(
    entries[0].lastModified.toISOString(),
    updatedAt.replace("Z", ".000Z"),
  );
});

test("keeps a statically analyzable 24 hour ISR fallback", () => {
  const sitemapSource = readFileSync(
    new URL("../src/app/sitemap.ts", import.meta.url),
    "utf8",
  );

  assert.match(sitemapSource, /export const revalidate = 86400;/);
});
