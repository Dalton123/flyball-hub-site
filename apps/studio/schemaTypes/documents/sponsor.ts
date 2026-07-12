import { MegaphoneIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor Campaign",
  type: "document",
  icon: MegaphoneIcon,
  description:
    "A date-bounded sponsor campaign that can be reused across relevant articles and pages.",
  fields: [
    defineField({
      name: "name",
      title: "Sponsor Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "campaignId",
      title: "Campaign ID",
      type: "slug",
      description:
        "Stable ID used for analytics and UTM tracking, for example barker-barker-2026-pilot.",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Draft", value: "draft" },
          { title: "Live", value: "live" },
          { title: "Ended", value: "ended" },
        ],
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startsAt",
      title: "Starts At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Ends At",
      type: "datetime",
      validation: (Rule) =>
        Rule.required().custom((endsAt, context) => {
          const startsAt = context.document?.startsAt;
          if (
            typeof endsAt === "string" &&
            typeof startsAt === "string" &&
            Date.parse(endsAt) <= Date.parse(startsAt)
          ) {
            return "The campaign must end after it starts";
          }
          return true;
        }),
    }),
    defineField({
      name: "destinationUrl",
      title: "Destination URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "desktopImage",
      title: "Desktop Image",
      type: "image",
      description: "Wide artwork used from tablet widths upwards.",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describe the visible offer and sponsor name. Do not repeat decorative details.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Mobile Image",
      type: "image",
      description: "Portrait or card artwork used on narrow screens.",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describe the visible offer and sponsor name. Do not repeat decorative details.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "supportingCopy",
      title: "Supporting Copy",
      type: "text",
      rows: 2,
      description:
        "Optional practical context. Keep this to one short sentence because the artwork may already contain the offer.",
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      initialValue: "Visit sponsor",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "discountCode",
      title: "Discount Code",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name",
      status: "status",
      endsAt: "endsAt",
      media: "desktopImage",
    },
    prepare({ title, status, endsAt, media }) {
      return {
        title: title || "Untitled sponsor",
        subtitle: [status, endsAt && `ends ${endsAt}`]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
