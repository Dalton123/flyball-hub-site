import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("./custom-url.ts", import.meta.url),
  "utf8",
);

test("custom links expose explicit affiliate metadata", () => {
  for (const fieldName of [
    "isAffiliate",
    "affiliateProgram",
    "affiliateMerchant",
    "affiliatePlacementId",
  ]) {
    assert.match(source, new RegExp(`name: ["']${fieldName}["']`));
  }
  assert.match(source, /Affiliate links must use an external URL/);
});
