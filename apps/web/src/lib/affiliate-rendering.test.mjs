import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const richTextSource = await readFile(
  new URL("../components/elements/rich-text.tsx", import.meta.url),
  "utf8",
);
const querySource = await readFile(
  new URL("./sanity/query.ts", import.meta.url),
  "utf8",
);

test("rich text tracks explicitly marked affiliate links", () => {
  assert.match(richTextSource, /trackAffiliateClick\(/);
  assert.match(richTextSource, /getExternalLinkRel\(/);
});

test("Sanity queries project affiliate metadata", () => {
  for (const fieldName of [
    "isAffiliate",
    "affiliateProgram",
    "affiliateMerchant",
    "affiliatePlacementId",
  ]) {
    assert.match(querySource, new RegExp(`\\b${fieldName}\\b`));
  }
});
