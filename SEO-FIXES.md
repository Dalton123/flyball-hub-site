# Flyball Hub SEO Fixes

## Checklist

### Code Fixes (AI will do)

- [x] **1. JSON-LD logo validation** - `apps/web/src/components/json-ld.tsx`
  - Line 229-234: Change `Organization.logo` from `ImageObject` to string URL
  - Line 153-158: Same fix for `publisher.logo` in ArticleJsonLd

- [x] **2. Duplicate H1 in team-finder** - `apps/web/src/components/sections/team-finder.tsx`
  - Lines 56 and 216 both have `<h1>` tags
  - Change line 216 to `<h2>`

- [x] **3. Add `<main>` landmark to PageBuilder** - `apps/web/src/components/pagebuilder.tsx`
  - Line 316: Change `<section>` to `<main>`

- [x] **4. Add skip-to-content link** - `apps/web/src/app/layout.tsx`
  - Add visually hidden skip link before Navbar
  - Add `id="main-content"` to PageBuilder's main element

- [x] **5. External links missing `rel="noopener"`** - TWO files need fixing:
  - `apps/web/src/components/elements/sanity-buttons.tsx` line 36-40
  - `apps/web/src/components/elements/rich-text.tsx` line 177 (customLink)

- [x] **6. Social link aria-label mismatch** - `apps/web/src/components/footer.tsx`
  - Line 93: Remove `<span className="sr-only">{label}</span>` (redundant with aria-label)

### CMS Content Fixes (You will do manually)

- [ ] **7. Title length issues** - 11 pages too long/short (aim 30-60 chars)
  - Too long: /features, /blog/tracking-dog-pbs..., /blog/how-we-plan..., /blog/flyball-dog-health, /blog/couch-to-5k-with-dog
  - Too short: /contact, /privacy-policy, /learn-flyball, /cookie-policy, /terms
- [ ] **8. Meta description too short** - `/privacy-policy`, `/terms`, `/cookie-policy`
- [ ] **9. Thin content** - `/faqs` (118 words), `/affiliate-disclosure` (205 words)
- [ ] **10. Heading skip on affiliate-disclosure** - H1 -> H3 (should be H2)

### Investigate

- [x] **11. Sanity token in JS bundle** - False positive. Actual tokens are server-only (no NEXT_PUBLIC_ prefix). Scanner flagged public IDs (Sanity project ID, AdSense) which are intentionally client-side.

### Lower Priority / Later

- [ ] **12. LCP image preload hints**
- [ ] **13. Security headers (CSP, X-Frame-Options)** - Vercel/next.config
- [ ] **14. Orphan pages** - Add more internal links

---

## Files Modified

| File | Line(s) | Change |
|------|---------|--------|
| `apps/web/src/components/json-ld.tsx` | 153-158, 229-234 | Change `{ "@type": "ImageObject", url: ... }` to just the URL string |
| `apps/web/src/components/sections/team-finder.tsx` | 216 | Change `<h1>` to `<h2>` |
| `apps/web/src/components/pagebuilder.tsx` | 316 | Change `<section>` to `<main id="main-content">` |
| `apps/web/src/app/layout.tsx` | ~116 | Add skip link before `<Navbar>` |
| `apps/web/src/components/elements/sanity-buttons.tsx` | 38 | Add `rel={openInNewTab ? "noopener noreferrer" : undefined}` |
| `apps/web/src/components/elements/rich-text.tsx` | 177 | Add `rel={value.openInNewTab ? "noopener noreferrer" : undefined}` |
| `apps/web/src/components/footer.tsx` | 93 | Remove redundant sr-only span |

## Verification

After all code fixes:
1. `pnpm build` - ensure no build errors
2. Deploy to preview/prod
3. `squirrel audit https://www.flyballhub.com -m 20` - re-check score
4. Check JSON-LD in browser DevTools: View Source → search for `application/ld+json`
