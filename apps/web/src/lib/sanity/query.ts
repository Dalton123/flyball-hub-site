import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  "alt": alt,
  hotspot {
    x,
    y
  },
  crop {
    bottom,
    left,
    right,
    top
  }
`;
// Base fragments for reusable query parts
const imageFragment = /* groq */ `
  image {
    ${imageFields}
  }
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
    _type == "image" => {
      ${imageFields},
      "alt": alt,
      "caption": caption
    },
    _type == "break" => {
      _type,
      _key,
      style
    },
    _type == "blockquote" => {
      _type,
      _key,
      quote,
      attribution,
      source
    },
    _type == "codeBlock" => {
      _type,
      _key,
      code,
      language,
      filename,
      highlightLines
    },
    _type == "table" => {
      _type,
      _key,
      rows
    }
  }
`;

const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = /* groq */ `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment}
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

// Page builder block fragments
const ctaBlock = /* groq */ `
  _type == "cta" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
  }
`;
const imageLinkCardsBlock = /* groq */ `
  _type == "imageLinkCards" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
    "cards": array::compact(cards[]{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      ),
      ${imageFragment},
    })
  }
`;

const heroBlock = /* groq */ `
  _type == "hero" => {
    ...,
    ${imageFragment},
    ${buttonsFragment},
    ${richTextFragment},
    variant,
    "stats": array::compact(stats[]{
      _key,
      value,
      label
    })
  }
`;

const faqFragment = /* groq */ `
  "faqs": array::compact(faqs[]->{
    title,
    _id,
    _type,
    ${richTextFragment}
  })
`;

const faqAccordionBlock = /* groq */ `
  _type == "faqAccordion" => {
    ...,
    ${faqFragment},
    link{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

const subscribeNewsletterBlock = /* groq */ `
  _type == "subscribeNewsletter" => {
    ...,
    "subTitle": subTitle[]{
      ...,
      ${markDefsFragment}
    },
    "helperText": helperText[]{
      ...,
      ${markDefsFragment}
    }
  }
`;

const featureCardsIconBlock = /* groq */ `
  _type == "featureCardsIcon" => {
    ...,
    ${richTextFragment},
    "cards": array::compact(cards[]{
      ...,
      ${richTextFragment},
    })
  }
`;

const textBlockFragment = /* groq */ `
  _type == "textBlock" => {
    ...,
    ${richTextFragment}
  }
`;

const testimonialsBlock = /* groq */ `
  _type == "testimonials" => {
    ...,
    ${richTextFragment},
    "testimonials": array::compact(testimonials[]{
      ...,
      _key,
      quote,
      authorName,
      authorRole,
      rating,
      "authorImage": authorImage {
        ${imageFields}
      }
    })
  }
`;

const logoCloudBlock = /* groq */ `
  _type == "logoCloud" => {
    ...,
    ${richTextFragment},
    "logos": array::compact(logos[]{
      ...,
      _key,
      name,
      url,
      "logo": logo {
        ${imageFields}
      }
    })
  }
`;

const statsSectionBlock = /* groq */ `
  _type == "statsSection" => {
    ...,
    ${richTextFragment},
    variant,
    "stats": array::compact(stats[]{
      ...,
      _key,
      value,
      label,
      description
    })
  }
`;

const macbookScrollBlock = /* groq */ `
  _type == "macbookScroll" => {
    ...,
    eyebrow,
    title,
    description,
    "screenImage": screenImage {
      ${imageFields}
    },
    showGradient
  }
`;

const featureCardsScreenshotBlock = /* groq */ `
  _type == "featureCardsScreenshot" => {
    ...,
    ${richTextFragment},
    "cards": array::compact(cards[]{
      ...,
      _key,
      title,
      description,
      "screenshot": screenshot {
        ${imageFields}
      },
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    })
  }
`;

const videoSectionBlock = /* groq */ `
  _type == "videoSection" => {
    ...,
    eyebrow,
    title,
    description,
    videoUrl,
    "posterImage": posterImage {
      ${imageFields}
    }
  }
`;

const latestPostsBlock = /* groq */ `
  _type == "latestPosts" => {
    ...,
    eyebrow,
    title,
    description,
    postsCount,
    showViewAll,
    "posts": *[_type == "blog" && seoHideFromLists != true && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc)[0..6]{
      ${blogCardFragment}
    }
  }
`;

const teamFinderTeaserBlock = /* groq */ `
  _type == "teamFinderTeaser" => {
    _type,
    _key,
    eyebrow,
    title,
    description,
    searchPlaceholder,
    showStats,
    ctaText
  }
`;

const teamFinderBlock = /* groq */ `
  _type == "teamFinder" => {
    _type,
    _key,
    eyebrow,
    title,
    description,
    searchPlaceholder,
    noResultsMessage
  }
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    ${ctaBlock},
    ${heroBlock},
    ${faqAccordionBlock},
    ${featureCardsIconBlock},
    ${featureCardsScreenshotBlock},
    ${subscribeNewsletterBlock},
    ${imageLinkCardsBlock},
    ${textBlockFragment},
    ${testimonialsBlock},
    ${logoCloudBlock},
    ${statsSectionBlock},
    ${macbookScrollBlock},
    ${videoSectionBlock},
    ${latestPostsBlock},
    ${teamFinderBlock},
    ${teamFinderTeaserBlock}
  }
`;

/**
 * Query to extract a single image from a page document
 * This is used as a type reference only and not for actual data fetching
 * Helps with TypeScript inference for image objects
 */
export const queryImageType = defineQuery(`
  *[_type == "page" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

export const queryHomePageData =
  defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    ...,
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    ${pageBuilderFragment}
  }`);

export const querySlugPageData = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const querySlugPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const queryBlogIndexPageData = defineQuery(`
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current,
    "blogs": *[_type == "blog" && seoHideFromLists != true && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc){
      ${blogCardFragment}
    }
  }
`);

export const queryBlogSlugPageData = defineQuery(`
  *[_type == "blog" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()].slug.current
`);

const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

export const queryHomePageOGData = defineQuery(`
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
  `);

export const querySlugPageOGData = defineQuery(`
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryBlogPageOGData = defineQuery(`
  *[_type == "blog" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryFooterData = defineQuery(`
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    subtitle,
    columns[]{
      _key,
      title,
      links[]{
        _key,
        name,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        ),
      }
    }
  }
`);

export const queryNavbarData = defineQuery(`
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    columns[]{
      _key,
      _type == "navbarColumn" => {
        "type": "column",
        title,
        links[]{
          _key,
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        }
      },
      _type == "navbarLink" => {
        "type": "link",
        name,
        description,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    },
    ${buttonsFragment},
  }
`);

export const querySitemapData = defineQuery(`{
  "slugPages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "blogPages": *[_type == "blog" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]{
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`);
export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    logo {
      ${imageFields}
    },
    siteDescription,
    showFooter,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    }
  }
`);

export const querySettingsData = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "logo": logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
  }
`);

export const queryRedirects = defineQuery(`
  *[_type == "redirect"]{
    "source":source.current,
    "destination":destination.current,
    permanent
  }
`);

export const queryHtmlSitemapData = defineQuery(`{
  "pages": *[_type == "page" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current
  },
  "blogs": *[_type == "blog" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt
  }
}`);