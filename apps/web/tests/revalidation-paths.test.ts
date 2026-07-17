import assert from "node:assert/strict";
import test from "node:test";

import { getContentRevalidationPaths } from "../src/app/api/revalidate/revalidation-paths";

for (const type of ["blog", "page", "breed"]) {
  test(`${type} updates invalidate the sitemap`, () => {
    assert.deepEqual(
      getContentRevalidationPaths({
        _type: type,
        slug: { current: "/blog/dog-recall-training" },
      }),
      ["/blog/dog-recall-training", "/sitemap.xml"],
    );
  });
}

test("content without a slug still invalidates the sitemap", () => {
  assert.deepEqual(getContentRevalidationPaths({ _type: "blog" }), [
    "/sitemap.xml",
  ]);
});

test("unrelated Sanity documents do not invalidate the sitemap", () => {
  assert.deepEqual(getContentRevalidationPaths({ _type: "settings" }), []);
});
