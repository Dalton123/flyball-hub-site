interface RevalidationBody {
  _type: string;
  slug?: { current?: string };
}

const sitemapDocumentTypes = new Set(["blog", "page", "breed"]);

function publicPathFor(_type: string, slug: string): string {
  const rootedSlug = `/${slug.replace(/^\/+/, "")}`;
  if (_type === "blog") {
    return rootedSlug.startsWith("/blog/") ? rootedSlug : `/blog${rootedSlug}`;
  }
  if (_type === "breed") {
    return rootedSlug.startsWith("/breeds/")
      ? rootedSlug
      : `/breeds${rootedSlug}`;
  }
  return rootedSlug;
}

export function getContentRevalidationPaths({
  _type,
  slug,
}: RevalidationBody): string[] {
  const paths = new Set<string>();

  if (slug?.current) {
    paths.add(publicPathFor(_type, slug.current));
  }

  if (sitemapDocumentTypes.has(_type)) {
    paths.add("/sitemap.xml");
  }

  return [...paths];
}
