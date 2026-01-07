import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  icon: Star,
  type: "object",
  fields: [
    defineField({
      name: "badge",
      type: "string",
      title: "Badge",
      description:
        "Optional badge text displayed above the title, useful for highlighting new features or promotions",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The main heading text for the hero section that captures attention",
    }),
    richTextField,
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description:
        "The main hero image - should be high quality and visually impactful",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe this image for screen readers and SEO",
        }),
      ],
    }),
    buttonsField,
    defineField({
      name: "stats",
      type: "array",
      title: "Social Proof Stats",
      description:
        "Key metrics to display below the hero content (e.g., '150+ Teams', 'Lightning Fast')",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              type: "string",
              title: "Value",
              description: "The statistic value (e.g., '150+', 'Lightning Fast')",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              description: "Description of the stat (e.g., 'Teams', 'Performance')",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              value: "value",
              label: "label",
            },
            prepare: ({ value, label }) => ({
              title: value,
              subtitle: label,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "variant",
      type: "string",
      title: "Hero Variant",
      description: "Choose the visual style for this hero section",
      options: {
        list: [
          { title: "Globe (Interactive world map)", value: "globe" },
          { title: "Dynamic (Bold, energetic design)", value: "dynamic" },
          { title: "Classic (Original design)", value: "classic" },
        ],
        layout: "radio",
      },
      initialValue: "classic",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Hero Block",
    }),
  },
});
