import assert from "node:assert/strict";

const { buildPageJsonLd, buildPageBreadcrumbItems } =
  await import("../src/lib/structured-data/page-schema.ts");

const page = {
  title: "Flyball Equipment and Safety: What Beginners Need",
  description: "Learn what flyball equipment beginners need.",
  seoTitle: null,
  seoDescription: null,
  slug: "/equipment-and-safety",
  _updatedAt: "2026-05-19T13:30:12Z",
};

const jsonLd = buildPageJsonLd(page, {
  baseUrl: "https://www.flyballhub.com",
  siteTitle: "Flyball Hub",
});

assert.equal(jsonLd["@context"], "https://schema.org");
assert.equal(jsonLd["@type"], "WebPage");
assert.equal(jsonLd.name, "Flyball Equipment and Safety: What Beginners Need");
assert.equal(
  jsonLd.description,
  "Learn what flyball equipment beginners need.",
);
assert.equal(jsonLd.url, "https://www.flyballhub.com/equipment-and-safety");
assert.equal(jsonLd.isPartOf["@type"], "WebSite");
assert.equal(jsonLd.isPartOf.name, "Flyball Hub");
assert.equal(jsonLd.breadcrumb["@type"], "BreadcrumbList");
assert.deepEqual(
  jsonLd.breadcrumb.itemListElement.map((item) => ({
    position: item.position,
    name: item.name,
    item: item.item,
  })),
  [
    { position: 1, name: "Home", item: "https://www.flyballhub.com" },
    {
      position: 2,
      name: "Flyball Equipment and Safety: What Beginners Need",
      item: "https://www.flyballhub.com/equipment-and-safety",
    },
  ],
);

assert.deepEqual(buildPageBreadcrumbItems(page), [
  { name: "Home", url: "/" },
  {
    name: "Flyball Equipment and Safety: What Beginners Need",
    url: "/equipment-and-safety",
  },
]);

console.log("page schema tests passed");
