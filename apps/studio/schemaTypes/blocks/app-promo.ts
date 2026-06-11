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
      name: "useGlobalDefaults",
      title: "Use Global App Promo Defaults",
      type: "boolean",
      description:
        "Keep enabled for the shared Flyball Hub app copy from Settings. Disable only when this page needs a specific override.",
      initialValue: true,
    }),
    defineField({
      name: "eyebrow",
      title: "Badge Text",
      type: "string",
      description: "Small badge text, for example 'Free team app'.",
      initialValue: "Free team app",
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading for the promo section",
      initialValue: "Run your flyball team from your pocket",
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    }),
    defineField({
      name: "highlightedText",
      title: "Highlighted Text",
      type: "string",
      description:
        "Part of the title to highlight with lime gradient, for example 'from your pocket'.",
      initialValue: "from your pocket",
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Supporting text below the headline",
      initialValue:
        "Keep dogs, handlers, training plans and event details in one place, whether your club is across town or across the world.",
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    }),
    defineField({
      name: "features",
      title: "Feature Highlights",
      type: "array",
      description: "Key features to highlight (max 3)",
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
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
        "Trust indicator text. Prefer broad verified language over stale hardcoded counts.",
      initialValue: "Built for flyball teams around the world",
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    }),
    defineField({
      name: "showStarRating",
      title: "Show Star Rating",
      type: "boolean",
      description:
        "Only enable if the rating value is currently verified from an app store or review source.",
      initialValue: false,
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    }),
    defineField({
      name: "starRating",
      title: "Star Rating Value",
      type: "string",
      description:
        "Verified rating value, for example 4.9. Leave blank otherwise.",
      hidden: ({ parent }) =>
        parent?.useGlobalDefaults !== false || !parent?.showStarRating,
    }),
    {
      ...buttonsField,
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    },
    defineField({
      name: "platformNote",
      title: "Platform Note",
      type: "string",
      description: "Text below CTAs about platform availability",
      initialValue: "Use it on the web, iOS or Android",
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
    }),
    createImageField(
      "phoneScreenshot",
      "Phone Screenshot (Optional)",
      "Upload a real current app screenshot. Leave empty to use the generic honest app preview.",
    ),
    defineField({
      name: "showAppStoreButtons",
      title: "Show App Store Buttons",
      type: "boolean",
      description: "Display App Store and Google Play download badges",
      initialValue: false,
      hidden: ({ parent }) => parent?.useGlobalDefaults !== false,
      group: "appStore",
    }),
    defineField({
      name: "googlePlayUrl",
      title: "Google Play Store URL",
      type: "url",
      description: "Link to the app on Google Play Store",
      hidden: ({ parent }) =>
        parent?.useGlobalDefaults !== false || !parent?.showAppStoreButtons,
      group: "appStore",
    }),
    defineField({
      name: "appStoreUrl",
      title: "Apple App Store URL",
      type: "url",
      description:
        "Link to the app on Apple App Store. Leave empty if not yet available.",
      hidden: ({ parent }) =>
        parent?.useGlobalDefaults !== false || !parent?.showAppStoreButtons,
      group: "appStore",
    }),
    defineField({
      name: "appStoreComingSoon",
      title: "iOS Coming Soon",
      type: "boolean",
      description:
        "Show the iOS badge as greyed out with 'Coming Soon' text when the app isn't available yet",
      initialValue: false,
      hidden: ({ parent }) =>
        parent?.useGlobalDefaults !== false ||
        !parent?.showAppStoreButtons ||
        !!parent?.appStoreUrl,
      group: "appStore",
    }),
  ],
  groups: [
    {
      name: "appStore",
      title: "App Store Badges",
    },
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "App Promo",
      subtitle: "App Promo Section",
    }),
  },
});
