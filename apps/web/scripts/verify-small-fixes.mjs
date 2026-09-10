import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

// Reuse an installed Playwright package; no browser or dependency installation.
const require = createRequire(
  process.env.PLAYWRIGHT_PACKAGE_JSON || import.meta.url,
);
const { chromium } = require("playwright");
const base = process.env.VERIFY_BASE_URL || "http://127.0.0.1:3217";
assert.equal(new URL(base).hostname, "127.0.0.1", "This check is local-only");
const output = path.resolve(
  process.env.VERIFY_OUTPUT || "small-fixes-evidence",
);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const [label, viewport] of [
    ["mobile", { width: 390, height: 844 }],
    ["desktop", { width: 1440, height: 1000 }],
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    // Do not send analytics/ad traffic or synthetic affiliate clicks.
    await context.route("**/*", (route) => {
      const url = new URL(route.request().url());
      return ["127.0.0.1", "cdn.sanity.io"].includes(url.hostname) ||
        url.hostname.endsWith(".sanity.io")
        ? route.continue()
        : route.abort();
    });
    const page = await context.newPage();
    for (const pathname of ["/", "/breeds", "/features"]) {
      const response = await page.goto(base + pathname, {
        waitUntil: "networkidle",
        timeout: 90000,
      });
      assert.equal(response.status(), 200);
      const html = await response.text();
      const record = { viewport: label, pathname, status: response.status() };
      await writeFile(
        path.join(
          output,
          `${label}-${pathname === "/" ? "home" : pathname.slice(1)}.html`,
        ),
        html,
      );
      if (pathname === "/") {
        assert.match(html, /href="\/pricing"/);
        const link = page.getByRole("link", {
          name: "Compare plans and pricing",
          exact: true,
        });
        assert.equal(await link.count(), 1);
        await link.scrollIntoViewIfNeeded();
        assert.ok(await link.isVisible());
        await link.focus();
        assert.equal(
          await link.evaluate((node) => node === document.activeElement),
          true,
        );
        record.pricingLink = await link.getAttribute("href");
        record.adjacentToProduct = await page
          .getByRole("region", { name: "App pricing" })
          .evaluate((node) =>
            Boolean(
              node.previousElementSibling?.querySelector("#app-promo-heading"),
            ),
          );
        assert.equal(record.adjacentToProduct, true);
        record.horizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        assert.equal(record.horizontalOverflow, false);
        await page.screenshot({
          path: path.join(output, `${label}-home-pricing.png`),
        });
        await Promise.all([
          page.waitForURL(base + "/pricing"),
          link.press("Enter"),
        ]);
        assert.equal((await page.request.get(base + "/pricing")).status(), 200);
        record.keyboardDestination = new URL(page.url()).pathname;
      } else if (pathname === "/breeds") {
        assert.equal(await page.locator("main, [role=main]").count(), 1);
        assert.equal(await page.locator("#main-content").count(), 1);
        assert.equal(await page.locator("main#main-content h1").count(), 1);
        await page.keyboard.press("Tab");
        assert.equal(
          await page.evaluate(() => document.activeElement.textContent.trim()),
          "Skip to main content",
        );
        await page.keyboard.press("Enter");
        assert.equal(
          await page.evaluate(() => document.activeElement.id),
          "main-content",
        );
        record.mainCount = 1;
        record.skipFocus = "main-content";
        await page.screenshot({
          path: path.join(output, `${label}-breeds.png`),
        });
      } else {
        const title = "Features: teams, events and video timing | Flyball Hub";
        assert.equal(await page.title(), title);
        // SVG icons can contain accessible <title> nodes; only head owns the document title.
        assert.equal(await page.locator("head > title").count(), 1);
        assert.equal((await page.title()).match(/Flyball Hub/g).length, 1);
        assert.equal(
          await page.locator('link[rel="canonical"]').getAttribute("href"),
          `${process.env.VERIFY_CANONICAL_ORIGIN || "http://localhost:3000"}/features`,
        );
        assert.ok((await page.locator('a[href="/pricing"]').count()) >= 1);
        record.title = await page.title();
        record.ogTitle = await page
          .locator('meta[property="og:title"]')
          .getAttribute("content");
        record.twitterTitle = await page
          .locator('meta[name="twitter:title"]')
          .getAttribute("content");
        await page.screenshot({
          path: path.join(output, `${label}-features.png`),
        });
      }
      results.push(record);
    }
    await context.close();
  }
  await writeFile(
    path.join(output, "rendered-checks.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify({ passed: results.length, results }, null, 2));
} finally {
  await browser.close();
}
