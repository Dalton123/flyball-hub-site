import { Smartphone } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { buttonsField, createImageField } from "../common";

export const appPromo = defineType({
  name: "appPromo",
  title: "App Promo",
  type: "object",
  icon: Smartphone,
  description: "Promotional block for the Flyball Hub mobile app",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Badge Text",
      type: "string",
      description: "Small badge text (e.g., 'Free to Use', 'Mobile App')",
      initialValue: "Free to Use",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading for the promo section",
      initialValue: "Your Flyball Team, In Your Pocket",
    }),
    defineField({
      name: "highlightedText",
      title: "Highlighted Text",
      type: "string",
      description:
        "Part of the title to highlight with lime gradient (e.g., 'In Your Pocket')",
      initialValue: "In Your Pocket",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Supporting text below the headline",
    }),
    defineField({
      name: "features",
      title: "Feature Highlights",
      type: "array",
      description: "Key features to highlight (max 3)",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Users", value: "users" },
                  { title: "Calendar", value: "calendar" },
                  { title: "Layout Grid", value: "layoutGrid" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({
              title: title || "Feature",
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "socialProofText",
      title: "Social Proof Text",
      type: "string",
      description:
        "Trust indicator text (e.g., 'Trusted by 150+ teams in 12+ countries')",
    }),
    defineField({
      name: "showStarRating",
      title: "Show Star Rating",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "starRating",
      title: "Star Rating Value",
      type: "string",
      initialValue: "4.9",
    }),
    buttonsField,
    defineField({
      name: "platformNote",
      title: "Platform Note",
      type: "string",
      description: "Text below CTAs about platform availability",
      initialValue: "Works on any device — web, iOS & Android",
    }),
    createImageField(
      "phoneScreenshot",
      "Phone Screenshot (Optional)",
      "Upload a custom app screenshot. Leave empty to use the default app preview.",
    ),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "App Promo",
      subtitle: "App Promo Section",
    }),
  },
});
