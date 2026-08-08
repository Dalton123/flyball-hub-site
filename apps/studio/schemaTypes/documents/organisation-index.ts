import { Building2Icon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";
import { pageBuilderField } from "../common";

export const organisationIndex = defineType({
  name: "organisationIndex",
  title: "Organisations Listing Page",
  type: "document",
  icon: Building2Icon,
  groups: GROUPS,
  description: "The main index for verified flyball organisation guides.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "The page heading.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "A concise introduction to the organisation directory.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().min(40).max(300),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The listing page URL. This must be /organisations.",
      group: GROUP.MAIN_CONTENT,
      options: { source: "title", slugify: createSlug, isUnique },
      validation: (Rule) =>
        Rule.required().custom(
          createSlugValidator({
            documentType: "Organisation index",
            requiredPrefix: "/organisations",
          }),
        ),
    }),
    pageBuilderField,
    ...seoFields.filter((field) => field.name !== "seoHideFromLists"),
    ...ogFields,
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Organisations",
      subtitle,
    }),
  },
});
