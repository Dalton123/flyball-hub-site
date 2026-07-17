interface RevalidationBody {
  _type: string;
  slug?: { current?: string };
}

const sitemapDocumentTypes = new Set(["blog", "page", "breed"]);

export function getContentRevalidationPaths({
  _type,
  slug,
}: RevalidationBody): string[] {
  const paths = new Set<string>();

  if (slug?.current) {
    paths.add(slug.current);
  }

  if (sitemapDocumentTypes.has(_type)) {
    paths.add("/sitemap.xml");
  }

  return [...paths];
}
