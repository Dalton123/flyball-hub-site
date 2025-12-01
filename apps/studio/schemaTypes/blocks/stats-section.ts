import { TrendingUp } from "lucide-react";
import { defineField, defineType } from "sanity";
import { customRichText } from "../definitions/rich-text";

const statItem = defineField({
  name: "statItem",
  type: "object",
  fields: [
    defineField({
      name: "value",
      type: "string",
      title: "Value",
      description: "The statistic value (e.g., '500+', '2000+', '99%')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      description: "Description of the statistic (e.g., 'Active Teams', 'Dogs Registered')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Optional additional context or description for this stat",
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "value",
    },
  },
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Stats Section",
  type: "object",
  icon: TrendingUp,
  description: "Display key metrics and statistics with prominent numbers",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small text above the main title (e.g., 'By The Numbers')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for the stats section",
    }),
    customRichText(["block"]),
    defineField({
      name: "stats",
      type: "array",
      title: "Statistics",
      description: "Add key metrics to display",
      of: [statItem],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: "variant",
      type: "string",
      title: "Variant",
      description: "Choose the visual style for this section",
      options: {
        list: [
          { title: "Default (Light background)", value: "default" },
          { title: "Accent (Green background)", value: "accent" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Stats Section",
      subtitle: "Stats Section",
    }),
  },
});
