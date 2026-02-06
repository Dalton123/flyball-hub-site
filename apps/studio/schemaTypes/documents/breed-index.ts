import { PawPrintIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";
import { pageBuilderField } from "../common";

export const breedIndex = defineType({
  name: "breedIndex",
  type: "document",
  title: "Breeds Listing Page",
  icon: PawPrintIcon,
  description:
    "This is the main page that shows all dog breed guides. You can customize the title, description, and SEO settings.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "The main heading that will appear at the top of the breeds listing page",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "description",
      type: "text",
      description:
        "A short summary of what visitors can find on the breeds page. This appears below the title.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for your breeds page (for example, '/breeds' would create a page at yourdomain.com/breeds)",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        slugify: createSlug,
        isUnique: isUnique,
      },
      validation: (Rule) =>
        Rule.required().custom(
          createSlugValidator({
            documentType: "Breed index",
            requiredPrefix: "/breeds",
          }),
        ),
    }),
    pageBuilderField,
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name),
    ),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      slug: "slug.current",
    },
    prepare: ({ title, description, slug }) => ({
      title: title || "Untitled Breed Index",
      subtitle: description || slug || "Breed Index",
    }),
  },
});
