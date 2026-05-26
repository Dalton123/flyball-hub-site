import { createHmac } from "crypto";
import { parseBody } from "next-sanity/webhook";
import { readFileSync } from "fs";
import { join } from "path";

const envPath = join(import.meta.dirname, "../.env.local");
const envText = readFileSync(envPath, "utf-8");
const secretLine = envText.split("\n").find((l) => l.startsWith("SANITY_REVALIDATE_SECRET="));
const secret = (secretLine?.split("=")[1] || "").trim();
if (!secret) throw new Error("Missing SANITY_REVALIDATE_SECRET in .env.local");

const payload = JSON.stringify({
  _type: "blog",
  slug: { current: "/blog/dog-breeds-for-flyball" },
});

const timestamp = Date.now();
const message = `${timestamp}.${payload}`;

const sig = createHmac("sha256", secret)
  .update(message)
  .digest("base64url")
  .replace(/=+$/, "");

const header = `t=${timestamp},v1=${sig}`;

// Verify the generated signature is accepted by parseBody
const headers = new Map();
headers.set("sanity-webhook-signature", header);

const fakeReq = {
  headers: {
    get(name) {
      return headers.get(name);
    },
  },
  text: async () => payload,
};

parseBody(fakeReq, secret, false).then((result) => {
  if (result.isValidSignature) {
    console.log("SUCCESS: local signature validates with parseBody");
    console.log("Generated header:", header);
  } else {
    console.error("FAILURE: local signature rejected by parseBody");
    console.error(result);
    process.exit(1);
  }
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
