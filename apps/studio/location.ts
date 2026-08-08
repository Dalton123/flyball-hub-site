import { defineLocations } from "sanity/presentation";

export const locations = {
  blog: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `${doc?.slug}`,
          },
          {
            title: "Blog",
            href: "/blog",
          },
        ],
      };
    },
  }),
  home: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: () => {
      return {
        locations: [
          {
            title: "Home",
            href: "/",
          },
        ],
      };
    },
  }),
  page: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `${doc?.slug}`,
          },
        ],
      };
    },
  }),
  organisation: defineLocations({
    select: {
      title: "name",
      slug: "slug.current",
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Untitled organisation",
          href: `${doc?.slug}`,
        },
        {
          title: "Organisations",
          href: "/organisations",
        },
      ],
    }),
  }),
  organisationIndex: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Organisations",
          href: doc?.slug || "/organisations",
        },
      ],
    }),
  }),
};
