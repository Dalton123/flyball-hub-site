import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
// Exercise the real PageBuilder wrapper; isolate CMS optimism and child blocks.
const source = readFileSync(
  new URL("./pagebuilder.tsx", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const compiledModule = { exports: {} };
runInNewContext(compiled, {
  exports: compiledModule.exports,
  module: compiledModule,
  require: (name) => {
    if (name === "@sanity/visual-editing/react")
      return { useOptimistic: (value) => value };
    if (name === "next/dynamic")
      return {
        default: () => () => React.createElement("section", null, "Block"),
      };
    if (name === "next-sanity")
      return { createDataAttribute: () => "sanity-attribute" };
    if (name === "@/config") return {};
    if (name === "./sections/hero")
      return { HeroBlock: () => React.createElement("section", null, "Hero") };
    return require(name);
  },
});
const { PageBuilder } = compiledModule.exports;
const blocks = [
  { _key: "hero", _type: "hero" },
  { _key: "product", _type: "appPromo" },
];
const render = (props = {}) =>
  renderToStaticMarkup(
    React.createElement(PageBuilder, {
      id: "test",
      type: "page",
      pageBuilder: blocks,
      ...props,
    }),
  );

test("default PageBuilder retains its original main landmark and child order", () => {
  assert.equal(
    render(),
    '<main id="main-content" class="flex flex-col bg-background" data-sanity="sanity-attribute" aria-label="Page content"><div class="w-full" data-sanity="sanity-attribute"><section>Hero</section></div><div class="w-full" data-sanity="sanity-attribute"><section>Block</section></div></main>',
  );
});
test("embedded builder emits no duplicate landmark or skip target", () => {
  const html = render({ as: "div" });
  assert.ok(html.startsWith('<div class="flex flex-col bg-background"'));
  assert.doesNotMatch(html, /<main|main-content|aria-label/);
});
test("home insertion follows only the selected product block", () => {
  const html = render({
    afterBlock: {
      key: "product",
      content: React.createElement(
        "a",
        { href: "/pricing" },
        "Compare plans and pricing",
      ),
    },
  });
  assert.match(
    html,
    /<section>Block<\/section><\/div><a href="\/pricing">Compare plans and pricing<\/a><\/main>$/,
  );
});
test("unmatched insertion leaves other pages unchanged", () => {
  assert.equal(
    render({ afterBlock: { key: "missing", content: "Pricing" } }),
    render(),
  );
});
test("empty embedded builder does not manufacture another landmark", () => {
  assert.equal(render({ pageBuilder: [], as: "div" }), "");
});
