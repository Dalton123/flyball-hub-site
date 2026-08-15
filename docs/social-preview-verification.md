# Social preview verification

Use this check after OG/Twitter metadata changes, especially when dynamic OG cards change for blogs, Sanity pages, or breed pages.

Run locally from the repo root:

```bash
pnpm verify:social-preview
```

The default sample set covers:

- Homepage: `https://www.flyballhub.com/`
- Blog post: `https://www.flyballhub.com/blog/how-we-plan-a-flyball-training-session-and-keep-it-calm`
- Sanity page: `https://www.flyballhub.com/features`
- Breed page: `https://www.flyballhub.com/breeds/whippet`

You can pass specific URLs when checking a release candidate or a suspected regression:

```bash
pnpm verify:social-preview -- \
  https://www.flyballhub.com/ \
  https://www.flyballhub.com/blog/how-we-plan-a-flyball-training-session-and-keep-it-calm
```

What the script verifies:

- Fetches each page with `User-Agent: Twitterbot/1.0`.
- Confirms the page returns HTTP 200 and HTML.
- Confirms `twitter:card` is `summary_large_image`.
- Reads the exact `twitter:image` and `og:image` URLs emitted by the page.
- Fetches those exact image URLs with `Twitterbot/1.0`.
- Confirms each image returns HTTP 200, `image/jpeg` or `image/png`, and actual JPEG/PNG dimensions of 1200x630.
- Reports `og:image:width` and `og:image:height` metadata as warnings if they drift.

This check uses only Node's built-in `fetch` and binary header parsing, so it does not require paid external validators.

## Release workflow

1. Run `pnpm lint` and `pnpm build` for code quality.
2. Deploy the metadata or OG card change.
3. Run `pnpm verify:social-preview` against production.
4. If a URL fails, inspect the exact image URL in the output before changing code. A stale X/Twitter card can be a crawler cache issue even when the current page and image are valid.

## Crawler-cache caveat

X/Twitter, Facebook, Discord, Slack, and other platforms can keep stale failed scrapes. If production verifies correctly but a card still appears without an image, add or change a harmless version query parameter on the image URL, or share the page with a harmless query string to encourage a fresh scrape.
