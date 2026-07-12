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
    },
    _type == "sponsorPlacement" => {
      _type,
      _key,
      placementId,
      "sponsor": sponsor->{
        _id,
        name,
        "campaignId": campaignId.current,
        status,
        startsAt,
        endsAt,
        destinationUrl,
        supportingCopy,
        ctaLabel,
        discountCode,
        desktopImage {
          ${imageFields}
        },
        mobileImage {
          ${imageFields}
        }
      }
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

const appPromoButtonProjection = /* groq */ `
  text,
  variant,
  _key,
  _type,
  "openInNewTab": url.openInNewTab,
  "href": select(
    url.type == "internal" => url.internal->slug.current,
    url.type == "external" => url.external,
    url.href
  )
`;

const appPromoFeatureProjection = /* groq */ `
  _key,
  title,
  description,
  icon
`;

const appPromoDefaultsPath = '*[_type == "settings"][0].appPromoDefaults';
const appPromoUsesLocalFields = "useGlobalDefaults != true";

const appPromoBlock = /* groq */ `
  _type == "appPromo" => {
    _type,
    _key,
    "eyebrow": select(
      ${appPromoUsesLocalFields} && defined(eyebrow) => eyebrow,
      defined(${appPromoDefaultsPath}.eyebrow) => ${appPromoDefaultsPath}.eyebrow,
      null
    ),
    "title": select(
      ${appPromoUsesLocalFields} && defined(title) => title,
      defined(${appPromoDefaultsPath}.title) => ${appPromoDefaultsPath}.title,
      null
    ),
    "highlightedText": select(
      ${appPromoUsesLocalFields} && defined(highlightedText) => highlightedText,
      defined(${appPromoDefaultsPath}.highlightedText) => ${appPromoDefaultsPath}.highlightedText,
      null
    ),
    "description": select(
      ${appPromoUsesLocalFields} && defined(description) => description,
      defined(${appPromoDefaultsPath}.description) => ${appPromoDefaultsPath}.description,
      null
    ),
    "features": select(
      ${appPromoUsesLocalFields} && count(features[]) > 0 => features[] { ${appPromoFeatureProjection} },
      count(${appPromoDefaultsPath}.features[]) > 0 => ${appPromoDefaultsPath}.features[] { ${appPromoFeatureProjection} },
      null
    ),
    "socialProofText": select(
      ${appPromoUsesLocalFields} && defined(socialProofText) => socialProofText,
      defined(${appPromoDefaultsPath}.socialProofText) => ${appPromoDefaultsPath}.socialProofText,
      null
    ),
    "showStarRating": select(
      ${appPromoUsesLocalFields} && defined(showStarRating) => showStarRating,
      defined(${appPromoDefaultsPath}.showStarRating) => ${appPromoDefaultsPath}.showStarRating,
      false
    ),
    "starRating": select(
      ${appPromoUsesLocalFields} && defined(starRating) => starRating,
      defined(${appPromoDefaultsPath}.starRating) => ${appPromoDefaultsPath}.starRating,
      null
    ),
    "buttons": select(
      ${appPromoUsesLocalFields} && count(buttons[]) > 0 => buttons[] { ${appPromoButtonProjection} },
      count(${appPromoDefaultsPath}.buttons[]) > 0 => ${appPromoDefaultsPath}.buttons[] { ${appPromoButtonProjection} },
      null
    ),
    "platformNote": select(
      ${appPromoUsesLocalFields} && defined(platformNote) => platformNote,
      defined(${appPromoDefaultsPath}.platformNote) => ${appPromoDefaultsPath}.platformNote,
      null
    ),
    "phoneScreenshot": select(
      ${appPromoUsesLocalFields} && defined(phoneScreenshot.asset) => phoneScreenshot { ${imageFields} },
      defined(${appPromoDefaultsPath}.phoneScreenshot.asset) => ${appPromoDefaultsPath}.phoneScreenshot { ${imageFields} },
      null
    ),
    "showAppStoreButtons": select(
      ${appPromoUsesLocalFields} && defined(showAppStoreButtons) => showAppStoreButtons,
      defined(${appPromoDefaultsPath}.showAppStoreButtons) => ${appPromoDefaultsPath}.showAppStoreButtons,
      false
    ),
    "googlePlayUrl": select(
      ${appPromoUsesLocalFields} && defined(googlePlayUrl) => googlePlayUrl,
      defined(${appPromoDefaultsPath}.googlePlayUrl) => ${appPromoDefaultsPath}.googlePlayUrl,
      null
    ),
    "appStoreUrl": select(
      ${appPromoUsesLocalFields} && defined(appStoreUrl) => appStoreUrl,
      defined(${appPromoDefaultsPath}.appStoreUrl) => ${appPromoDefaultsPath}.appStoreUrl,
      null
    ),
    "appStoreComingSoon": select(
      ${appPromoUsesLocalFields} && defined(appStoreComingSoon) => appStoreComingSoon,
      false
    )
  }
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    ${appPromoBlock},
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
    _type == "sponsorPlacement" => {
      _type,
      _key,
      placementId,
      "sponsor": sponsor->{
        _id,
        name,
        "campaignId": campaignId.current,
        status,
        startsAt,
        endsAt,
        destinationUrl,
        supportingCopy,
        ctaLabel,
        discountCode,
        desktopImage {
          ${imageFields}
        },
        mobileImage {
          ${imageFields}
        }
      }
    },
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
    "seoImageUrl": seoImage.asset->url + "?w=1200&h=630&fit=fill&bg=fbf2d6&fm=jpg&q=85&v=20260607",
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
    "productList": productList[]{
      name,
      position,
      "url": url
    },
    "howToSteps": howToSteps[]{
      name,
      text,
      "url": url
    },
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()].slug.current
`);

// Breed queries
const breedCardFragment = /* groq */ `
  _id,
  _type,
  name,
  "slug": slug.current,
  verdict,
  verdictRating,
  ${imageFragment},
  stats
`;

export const queryBreedBySlug = defineQuery(`
  *[_type == "breed" && slug.current == $slug][0]{
    ...,
    _id,
    _type,
    name,
    "slug": slug.current,
    verdict,
    verdictRating,
    ${imageFragment},
    stats,
    pros,
    cons,
    ${richTextFragment}
  }
`);

export const queryBreedPaths = defineQuery(`
  *[_type == "breed" && defined(slug.current)].slug.current
`);

export const queryAllBreeds = defineQuery(`
  *[_type == "breed" && seoHideFromLists != true] | order(verdictRating desc, name asc){
    ${breedCardFragment}
  }
`);

export const queryBreedIndexPageData = defineQuery(`
  *[_type == "breedIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    ${pageBuilderFragment},
    "breeds": *[_type == "breed" && seoHideFromLists != true] | order(verdictRating desc, name asc){
      ${breedCardFragment}
    }
  }
`);

export const queryRelatedPosts = defineQuery(`
  *[_type == "blog"
    && _id != $currentId
    && seoHideFromLists != true
    && defined(publishedAt)
    && publishedAt <= now()
  ] | order(publishedAt desc) {
    ${blogCardFragment}
  }
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
  "image": coalesce(
    seoImage.asset->url + "?w=860&h=860&fit=crop&auto=format&q=86",
    image.asset->url + "?w=860&h=860&fit=crop&auto=format&q=86"
  ),
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&fit=fill&bg=fbf2d6&fm=jpg&q=85",
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=120&h=120&fit=max&auto=format&q=90",
  "date": coalesce(date, publishedAt, _createdAt)
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

export const queryBreedPageOGData = defineQuery(`
  *[_type == "breed" && _id == $id][0]{
    ${ogFieldsFragment},
    "title": select(
      defined(ogTitle) => ogTitle,
      defined(seoTitle) => seoTitle,
      name + " - Flyball Breed Guide"
    ),
    "description": select(
      defined(ogDescription) => ogDescription,
      defined(seoDescription) => seoDescription,
      defined(verdict) => verdict,
      "Breed guide for flyball suitability, training fit and team role."
    ),
    name,
    verdict,
    verdictRating,
    stats
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
  },
  "breedPages": *[_type == "breed" && defined(slug.current)]{
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
