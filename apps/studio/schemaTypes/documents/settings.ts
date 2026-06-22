import { CogIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { buttonsField, createImageField } from "../common";

const socialLinks = defineField({
  name: "socialLinks",
  title: "Social Media Links",
  description: "Add links to your social media profiles",
  type: "object",
  options: {},
  fields: [
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      description: "Full URL to your LinkedIn profile/company page",
      type: "string",
    }),
    defineField({
      name: "facebook",
      title: "Facebook URL",
      description: "Full URL to your Facebook profile/page",
      type: "string",
    }),
    defineField({
      name: "twitter",
      title: "Twitter/X URL",
      description: "Full URL to your Twitter/X profile",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      description: "Full URL to your Instagram profile",
      type: "string",
    }),
    defineField({
      name: "youtube",
      title: "YouTube URL",
      description: "Full URL to your YouTube channel",
      type: "string",
    }),
  ],
});

const appPromoDefaults = defineField({
  name: "appPromoDefaults",
  title: "App Promo Defaults",
  type: "object",
  description:
    "Single source of truth for App Promo sections. Existing page blocks use these values unless 'Override global app promo copy' is enabled on that block.",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "eyebrow",
      title: "Badge Text",
      type: "string",
      description: "Short badge shown above the headline.",
      initialValue: "Free team app",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading used by reusable App Promo blocks.",
      initialValue: "Run your flyball team from one place",
    }),
    defineField({
      name: "highlightedText",
      title: "Highlighted Text",
      type: "string",
      description: "Exact part of the title to highlight.",
      initialValue: "one place",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "Global-first supporting copy. Keep it honest and avoid hardcoded team counts unless recently verified.",
      initialValue:
        "Plan training, manage dogs and members, organise competitions, time runs from video, and keep race-day details together on web, iOS and Android.",
    }),
    defineField({
      name: "features",
      title: "Feature Highlights",
      type: "array",
      description:
        "Reusable feature bullets for App Promo sections. Keep to three.",
      initialValue: [
        {
          _key: "default-records",
          title: "Team planning",
          description:
            "Keep dogs, members, RSVPs, line-ups and repeated schedules tidy without spreadsheet drift",
          icon: "users",
        },
        {
          _key: "default-training-events",
          title: "Competition tools",
          description:
            "Plan race days, track heats, host public events and keep event comments with the right details",
          icon: "calendar",
        },
        {
          _key: "default-team-hub",
          title: "Stats and timing",
          description:
            "Record results, save dog splits from video timing and spot clearer performance trends",
          icon: "layoutGrid",
        },
      ],
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
            prepare: ({ title }) => ({ title: title || "Feature" }),
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
        "Optional trust text. Prefer broad, verified language over stale counts.",
      initialValue: "Built for flyball teams around the world",
    }),
    defineField({
      name: "showStarRating",
      title: "Show Star Rating",
      type: "boolean",
      description:
        "Only enable if the rating value is currently verified from an app store or review source.",
      initialValue: false,
    }),
    defineField({
      name: "starRating",
      title: "Star Rating Value",
      type: "string",
      description:
        "Verified rating value, for example 4.9. Leave blank otherwise.",
      hidden: ({ parent }) => !parent?.showStarRating,
    }),
    buttonsField,
    defineField({
      name: "platformNote",
      title: "Platform Note",
      type: "string",
      description: "Short availability note below the calls to action.",
      initialValue: "Use it on the web, iOS or Android",
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
      description:
        "Display App Store and Google Play badges when URLs are set.",
      initialValue: false,
    }),
    defineField({
      name: "googlePlayUrl",
      title: "Google Play Store URL",
      type: "url",
      description: "Canonical Google Play URL for Flyball Hub.",
      hidden: ({ parent }) => !parent?.showAppStoreButtons,
    }),
    defineField({
      name: "appStoreUrl",
      title: "Apple App Store URL",
      type: "url",
      description: "Canonical Apple App Store URL for Flyball Hub.",
      hidden: ({ parent }) => !parent?.showAppStoreButtons,
    }),
  ],
});

export const settings = defineType({
  name: "settings",
  type: "document",
  title: "Settings",
  description: "Global settings and configuration for your website",
  icon: CogIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      initialValue: "Settings",
      title: "Label",
      description: "Label used to identify settings in the CMS",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "siteTitle",
      type: "string",
      title: "Site Title",
      description:
        "The main title of your website, used in browser tabs and SEO",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "siteDescription",
      type: "text",
      title: "Site Description",
      description: "A brief description of your website for SEO purposes",
      validation: (rule) => rule.required().min(50).max(160),
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Site Logo",
      description: "Upload your website logo",
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
    defineField({
      name: "contactEmail",
      type: "string",
      title: "Contact Email",
      description: "Primary contact email address for your website",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "showFooter",
      type: "boolean",
      title: "Show Footer",
      description: "Toggle to show or hide the footer on your website",
      initialValue: true,
    }),
    socialLinks,
    appPromoDefaults,
  ],
  preview: {
    select: {
      title: "label",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Settings",
      media: CogIcon,
    }),
  },
});
