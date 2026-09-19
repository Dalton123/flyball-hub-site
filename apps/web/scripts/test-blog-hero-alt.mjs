import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);

// Load the real TSX without adding a test framework or contacting the CMS.
function loadTsx(path, dependencies) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: (id) => dependencies[id] ?? require(id),
    console,
    URLSearchParams,
  });
  return exports;
}

const { SanityImage } = loadTsx("../src/components/elements/sanity-image.tsx", {
  "@/config": { projectId: "testproject", dataset: "production" },
});

async function renderHero(image) {
  const empty = () => null;
  const { default: BlogSlugPage } = loadTsx("../src/app/blog/[slug]/page.tsx", {
    "next/navigation": { notFound: () => assert.fail("Unexpected 404") },
    "@/components/breadcrumbs": { Breadcrumbs: empty },
    "@/components/elements/rich-text": { RichText: empty },
    "@/components/elements/sanity-image": { SanityImage },
    "@/components/elements/table-of-content": { TableOfContent: empty },
    "@/components/json-ld": {
      ArticleJsonLd: empty,
      BreadcrumbJsonLd: empty,
      HowToJsonLd: empty,
      ItemListJsonLd: empty,
    },
    "@/components/related-posts": { RelatedPosts: empty },
    "@/lib/sanity/client": {
      client: { fetch: async () => ({ title: "Article title", image }) },
    },
    "@/lib/sanity/live": { sanityFetch: async () => ({ data: [] }) },
    "@/lib/sanity/query": {},
    "@/lib/seo": {},
  });
  return renderToStaticMarkup(
    await BlogSlugPage({
      params: Promise.resolve({ slug: "test-article" }),
    }),
  );
}

const image = { id: "image-abc123-1200x900-jpg" };

for (const [label, value] of [
  ["missing", undefined],
  ["null", null],
]) {
  test(`blog hero falls back to the article title for ${label} alt`, async () => {
    const html = await renderHero({ ...image, alt: value });
    assert.match(html, /<img[^>]*alt="Article title"/);
  });
}

test("blog hero preserves an explicitly empty decorative alt", async () => {
  const html = await renderHero({ ...image, alt: "" });
  assert.match(html, /<img[^>]*alt=""/);
});

test("blog hero renders the CMS image description rather than the article title", async () => {
  const html = await renderHero({
    ...image,
    alt: "A dog resting in a taupe bed.",
  });
  assert.match(html, /<img[^>]*alt="A dog resting in a taupe bed\."/);
});
