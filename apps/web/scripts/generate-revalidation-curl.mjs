import { createHmac } from "crypto";

const secret = (process.env.SANITY_REVALIDATE_SECRET || "").trim();
const slug = process.argv[2];

if (!secret) {
  console.error("Missing SANITY_REVALIDATE_SECRET environment variable.");
  process.exit(1);
}
if (!slug) {
  console.error("Usage: node scripts/generate-revalidation-curl.mjs \u003cslug\u003e");
  process.exit(1);
}

const payload = JSON.stringify({
  _type: "blog",
  slug: { current: slug },
});

const timestamp = Date.now();
const message = `${timestamp}.${payload}`;
const sig = createHmac("sha256", secret)
  .update(message)
  .digest("base64url")
  .replace(/=+$/, "");

const sigHeader = `t=${timestamp},v1=${sig}`;

console.log(
  `curl -X POST https://www.flyballhub.com/api/revalidate \\\n` +
    `  -H "Content-Type: application/json" \\\n` +
    `  -H "sanity-webhook-signature: ${sigHeader}" \\\n` +
    `  -d '${payload}'`
);
