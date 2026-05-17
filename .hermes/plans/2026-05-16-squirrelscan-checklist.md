# SquirrelScan Audit Checklist - Flyball Hub Marketing Site

## Performance

### [x] Lazy-loading above-fold images (53 pages)
- **Status**: FIXED
- **Root cause**: `SanityImage` component has no default `loading` prop -- when omitted, Next.js `<Image>` defaults to `loading="lazy"`. This affects all images unless explicitly overridden.
- **Investigation**: Audited all 16 components that use SanityImage:
  - Already correct (eager): `hero.tsx`, `hero-dynamic.tsx`, `blog/[slug]/page.tsx`, `breed-page.tsx`, `logo.tsx`
  - No images: `hero-globe.tsx` (WebGL/SVG only)
  - Below fold (lazy correct): `blog-card.tsx` (BlogCard), `breed-card.tsx`, `related-posts.tsx`, `image-link-card.tsx`, `feature-cards-screenshot.tsx`, `app-promo.tsx`, `testimonials.tsx`, `logo-cloud.tsx`, `macbook-scroll.tsx`, `video-section.tsx`, `rich-text.tsx`
  - **Above fold and wrong**: `blog-card.tsx` (FeaturedBlogCard) -- the featured blog image on `/blog` index is the first visual content but was using implicit lazy loading
- **Fix**: Added `eager` prop to `BlogImage` sub-component in `blog-card.tsx`. `FeaturedBlogCard` passes `eager` to get `loading="eager"` + `fetchPriority="high"`. Standard `BlogCard` stays lazy (correct for grid items below fold).
- **Files changed**: `apps/web/src/components/blog-card.tsx`
- **Branch**: `fix/lazy-loading-above-fold`
- **Notes**: The "53 pages" count refers to all image instances across all rendered pages. Only the FeaturedBlogCard was truly above-fold with wrong loading. The rest are correctly lazy or already eager.

---

## SEO

<!-- TODO: Add SEO checklist items -->

---

## Accessibility

<!-- TODO: Add a11y checklist items -->

---

## Best Practices

<!-- TODO: Add best practices checklist items -->
