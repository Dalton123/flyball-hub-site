import { client } from "@/lib/sanity/client";
import { queryRedirects } from "@/lib/sanity/query";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    reactCompiler: true,
    inlineCss: true,
  },
  // Icon library tree-shaking - prevents importing entire icon libraries
  modularizeImports: {
    "@tabler/icons-react": {
      transform: "@tabler/icons-react/dist/esm/icons/{{member}}",
    },
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },
  logging: {
    fetches: {},
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    const redirects = await client.fetch(queryRedirects);
    return redirects.map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      permanent: redirect.permanent ?? false,
    }));
  },
};

export default nextConfig;
