import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { customRichText } from "../definitions/rich-text";

const featureCardItem = defineField({
  name: "featureCardItem",
  type: "object",
  fields: [
    defineField({
      name: "screenshot",
      type: "image",
      title: "Screenshot",
      description: "Screenshot showcasing this feature (recommended: 800x600 or 4:3 ratio)",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe this image for screen readers and SEO",
        }),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Feature name or headline",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Brief description of the feature",
      rows: 2,
    }),
    defineField({
      name: "url",
      type: "optionalUrl",
      title: "Link URL",
      description: "Optional link - if set, the entire card becomes clickable",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "screenshot",
    },
  },
});

export const featureCardsScreenshot = defineType({
  name: "featureCardsScreenshot",
  title: "Feature Cards (Screenshot)",
  type: "object",
  icon: ImageIcon,
  description:
    "Showcase features with screenshots and a holographic hover effect",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small text above the title (e.g., 'Features')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for the features section",
    }),
    customRichText(["block"]),
    defineField({
      name: "cards",
      type: "array",
      title: "Feature Cards",
      description: "Add feature cards with screenshots",
      of: [featureCardItem],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: {
      title: "title",
      cards: "cards",
    },
    prepare: ({ title, cards }) => ({
      title: title || "Feature Cards (Screenshot)",
      subtitle: `${cards?.length || 0} features`,
    }),
  },
});
