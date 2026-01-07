import { MapPinIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const teamFinderTeaser = defineType({
  name: "teamFinderTeaser",
  title: "Team Finder Teaser",
  type: "object",
  icon: MapPinIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Small text above the title, like 'Find Your Pack' (optional)",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main headline, e.g. 'Find Teams Near You'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Supporting text below the title",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search Placeholder",
      type: "string",
      description: "Placeholder text for the search input",
      initialValue: "Enter city or country...",
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      description: "Text for the search button",
      initialValue: "Search",
    }),
    defineField({
      name: "showStats",
      title: "Show Live Stats",
      type: "boolean",
      description: "Display team count and countries from the live database",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
    },
    prepare: ({ title, eyebrow }) => ({
      title: title || "Team Finder Teaser",
      subtitle: eyebrow || "Team Finder",
    }),
  },
});
