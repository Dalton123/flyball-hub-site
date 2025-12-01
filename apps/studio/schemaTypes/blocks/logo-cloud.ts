import { LayoutGrid } from "lucide-react";
import { defineField, defineType } from "sanity";
import { customRichText } from "../definitions/rich-text";

const logoItem = defineField({
  name: "logoItem",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Organization Name",
      description: "Name of the league or organization (e.g., 'North American Flyball Association')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Logo",
      description: "Organization logo - should be high quality and ideally on transparent background",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      title: "Website URL",
      description: "Optional link to the organization's website",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});

export const logoCloud = defineType({
  name: "logoCloud",
  title: "Logo Cloud",
  type: "object",
  icon: LayoutGrid,
  description: "Display a grid of organization logos (leagues, partners, etc.)",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small text above the main title (e.g., 'Trusted By')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading (e.g., 'Works with all major flyball leagues')",
    }),
    customRichText(["block"]),
    defineField({
      name: "logos",
      type: "array",
      title: "Logos",
      description: "Add logos of organizations, leagues, or partners",
      of: [logoItem],
      validation: (Rule) => Rule.min(1).max(12),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Logo Cloud",
      subtitle: "Logo Cloud Section",
    }),
  },
});
