import assert from "node:assert/strict";
import test from "node:test";

import { getContentRevalidationPaths } from "../src/app/api/revalidate/revalidation-paths";

test("blog updates invalidate the public blog path and sitemap", () => {
  assert.deepEqual(
    getContentRevalidationPaths({
      _type: "blog",
      slug: { current: "dog-recall-training" },
    }),
    ["/blog/dog-recall-training", "/sitemap.xml"],
  );
});

test("page updates preserve an already rooted page path", () => {
  assert.deepEqual(
    getContentRevalidationPaths({
      _type: "page",
      slug: { current: "/features" },
    }),
    ["/features", "/sitemap.xml"],
  );
});

test("breed updates invalidate the public breed path and sitemap", () => {
  assert.deepEqual(
    getContentRevalidationPaths({
      _type: "breed",
      slug: { current: "whippet" },
    }),
    ["/breeds/whippet", "/sitemap.xml"],
  );
});

test("content without a slug still invalidates the sitemap", () => {
  assert.deepEqual(getContentRevalidationPaths({ _type: "blog" }), [
    "/sitemap.xml",
  ]);
});

test("unrelated Sanity documents do not invalidate the sitemap", () => {
  assert.deepEqual(getContentRevalidationPaths({ _type: "settings" }), []);
});
