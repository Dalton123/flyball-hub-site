import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { Building2Icon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";

const currentYear = new Date().getFullYear();
const isFutureDate = (value?: string) =>
  value && new Date(value).getTime() > Date.now()
    ? "Verification dates cannot be in the future"
    : true;

export const organisation = defineType({
  name: "organisation",
  title: "Flyball Organisation",
  type: "document",
  icon: Building2Icon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description:
    "An authoritative guide to a flyball league, governing body, or sanctioning organisation.",
  fields: [
    orderRankField({ type: "organisation" }),
    defineField({
      name: "name",
      title: "Official name",
      type: "string",
      description: "The organisation's full official name.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "shortName",
      title: "Short name",
      type: "string",
      description:
        "The acronym or familiar short name used by the organisation.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().min(2).max(30),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "The public URL, beginning with /organisations/.",
      group: GROUP.MAIN_CONTENT,
      components: { field: PathnameFieldComponent },
      options: { source: "name", slugify: createSlug, isUnique },
      validation: (Rule) => [
        Rule.required(),
        Rule.custom(
          createSlugValidator({
            documentType: "Organisation page",
            requiredPrefix: "/organisations/",
          }),
        ),
      ],
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description:
        "A concise, factual introduction for cards and the page hero.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().min(40).max(300),
    }),
    defineField({
      name: "organisationType",
      title: "Organisation type",
      type: "string",
      group: GROUP.MAIN_CONTENT,
      options: {
        layout: "radio",
        list: [
          { title: "League", value: "league" },
          { title: "Governing body", value: "governingBody" },
          { title: "Sanctioning body", value: "sanctioningBody" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "region",
      title: "Primary region",
      type: "string",
      description:
        "The main geographic area served, such as Europe or North America.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "countries",
      title: "Countries",
      type: "array",
      description:
        "Countries in which the organisation operates or sanctions competition.",
      group: GROUP.MAIN_CONTENT,
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: "foundedYear",
      title: "Founded year",
      type: "number",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.integer().min(1800).max(currentYear),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Historical", value: "historical" },
        ],
      },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      description: "Optional organisation logo or representative image.",
      group: GROUP.MAIN_CONTENT,
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
    }),
    defineField({
      name: "quickFacts",
      title: "Quick facts",
      type: "object",
      group: GROUP.MAIN_CONTENT,
      fields: [
        defineField({
          name: "geographicCoverage",
          title: "Geographic coverage",
          type: "string",
        }),
        defineField({
          name: "competitionModel",
          title: "Competition model",
          type: "string",
        }),
        defineField({
          name: "membershipModel",
          title: "Membership model",
          type: "string",
        }),
        defineField({
          name: "titleProgrammes",
          title: "Title programmes",
          type: "string",
        }),
        defineField({
          name: "flagshipEvent",
          title: "Flagship event",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "officialLinks",
      title: "Official links",
      type: "array",
      description:
        "Verified first-party destinations. Mark no more than one as primary.",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          name: "officialLink",
          title: "Official link",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "category",
              type: "string",
              options: {
                list: [
                  { title: "Official website", value: "officialSite" },
                  { title: "Rules", value: "rules" },
                  { title: "Join or register", value: "joinRegister" },
                  { title: "Events", value: "events" },
                  { title: "Results", value: "results" },
                  { title: "Records", value: "records" },
                  { title: "Titles and awards", value: "titles" },
                  { title: "Team or club finder", value: "teamClubFinder" },
                  { title: "Contact", value: "contact" },
                  { title: "Other", value: "other" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "primary",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "verifiedAt",
              title: "Verified at",
              type: "date",
              validation: (Rule) => Rule.required().custom(isFutureDate),
            }),
            defineField({
              name: "accessNote",
              title: "Access note",
              type: "string",
              validation: (Rule) => Rule.max(160),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .unique()
          .custom((links) => {
            const primaryLinks = (
              (links ?? []) as Array<{ primary?: boolean }>
            ).filter((link) => link.primary);
            return primaryLinks.length <= 1
              ? true
              : "Only one official link can be primary";
          }),
    }),
    defineField({
      name: "richText",
      title: "Organisation guide",
      type: "richText",
      description: "Detailed, neutral information about the organisation.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "officialSources",
      title: "Official sources",
      type: "array",
      description: "First-party sources used to verify this page.",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          name: "officialSource",
          title: "Official source",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "verifiedAt",
              title: "Verified at",
              type: "date",
              validation: (Rule) => Rule.required().custom(isFutureDate),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: "lastVerifiedAt",
      title: "Page last verified",
      type: "date",
      description:
        "When the organisation facts were last checked against official sources.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().custom(isFutureDate),
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: { title: "name", subtitle: "shortName", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Untitled organisation",
      subtitle,
      media,
    }),
  },
});
