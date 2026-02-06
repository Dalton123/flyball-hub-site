import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { PawPrintIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";

export const breed = defineType({
  name: "breed",
  title: "Dog Breed",
  type: "document",
  icon: PawPrintIcon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description:
    "A dog breed page for flyball suitability. Includes breed stats, pros/cons, and detailed content.",
  fields: [
    orderRankField({ type: "breed" }),
    defineField({
      name: "name",
      type: "string",
      title: "Breed Name",
      description: "The name of the dog breed (e.g., Border Collie)",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Breed name is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      description:
        "The web address where people can find this breed page (automatically created from name)",
      group: GROUP.MAIN_CONTENT,
      components: {
        field: PathnameFieldComponent,
      },
      options: {
        source: "name",
        slugify: createSlug,
        isUnique,
      },
      validation: (Rule) => [
        Rule.required().error("A URL slug is required"),
        Rule.custom(
          createSlugValidator({
            documentType: "Breed page",
            requiredPrefix: "/breeds/",
          }),
        ),
      ],
    }),
    defineField({
      name: "verdict",
      type: "string",
      title: "Verdict",
      description:
        "A short verdict summarising this breed for flyball (e.g., 'The gold standard for flyball')",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => [
        Rule.required().error("Verdict is required"),
        Rule.max(100).warning("Keep the verdict under 100 characters"),
      ],
    }),
    defineField({
      name: "verdictRating",
      type: "number",
      title: "Verdict Rating",
      description: "Overall flyball suitability rating from 1 to 5",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => [
        Rule.required().error("Rating is required"),
        Rule.min(1).error("Minimum rating is 1"),
        Rule.max(5).error("Maximum rating is 5"),
        Rule.integer().error("Rating must be a whole number"),
      ],
      options: {
        list: [
          { title: "1 - Poor", value: 1 },
          { title: "2 - Below Average", value: 2 },
          { title: "3 - Average", value: 3 },
          { title: "4 - Good", value: 4 },
          { title: "5 - Excellent", value: 5 },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Breed Image",
      description: "A representative image of the breed",
      type: "image",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
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
      name: "stats",
      type: "object",
      title: "Breed Stats",
      description: "Key statistics about this breed for flyball",
      group: GROUP.MAIN_CONTENT,
      fields: [
        defineField({
          name: "size",
          type: "string",
          title: "Size",
          options: {
            list: [
              { title: "Small", value: "Small" },
              { title: "Medium", value: "Medium" },
              { title: "Large", value: "Large" },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "energy",
          type: "number",
          title: "Energy Level",
          description: "Energy level from 1 to 5",
          validation: (Rule) => [
            Rule.required(),
            Rule.min(1),
            Rule.max(5),
            Rule.integer(),
          ],
          options: {
            list: [
              { title: "1 - Very Low", value: 1 },
              { title: "2 - Low", value: 2 },
              { title: "3 - Moderate", value: 3 },
              { title: "4 - High", value: 4 },
              { title: "5 - Very High", value: 5 },
            ],
          },
        }),
        defineField({
          name: "trainability",
          type: "number",
          title: "Trainability",
          description: "How easy to train from 1 to 5",
          validation: (Rule) => [
            Rule.required(),
            Rule.min(1),
            Rule.max(5),
            Rule.integer(),
          ],
          options: {
            list: [
              { title: "1 - Very Difficult", value: 1 },
              { title: "2 - Difficult", value: 2 },
              { title: "3 - Moderate", value: 3 },
              { title: "4 - Easy", value: 4 },
              { title: "5 - Very Easy", value: 5 },
            ],
          },
        }),
        defineField({
          name: "speed",
          type: "string",
          title: "Speed",
          options: {
            list: [
              { title: "Slow", value: "Slow" },
              { title: "Medium", value: "Medium" },
              { title: "Fast", value: "Fast" },
              { title: "Very Fast", value: "Very Fast" },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "heightDog",
          type: "boolean",
          title: "Height Dog Potential",
          description:
            "Can this breed serve as a height dog (smaller dogs that lower the hurdles)?",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "pros",
      type: "array",
      title: "Pros",
      description: "Advantages of this breed for flyball",
      group: GROUP.MAIN_CONTENT,
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.min(1).error("At least one pro is required"),
    }),
    defineField({
      name: "cons",
      type: "array",
      title: "Cons",
      description: "Disadvantages or challenges of this breed for flyball",
      group: GROUP.MAIN_CONTENT,
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.min(1).error("At least one con is required"),
    }),
    defineField({
      name: "richText",
      type: "richText",
      title: "Content",
      description: "Detailed content about this breed and flyball",
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      rating: "verdictRating",
      isPrivate: "seoNoIndex",
      isHidden: "seoHideFromLists",
    },
    prepare: ({ title, media, rating, isPrivate, isHidden }) => {
      let visibility = "";
      if (isPrivate) {
        visibility = " | 🔒 Private";
      } else if (isHidden) {
        visibility = " | 🙈 Hidden";
      }

      const stars = rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "";

      return {
        title: title || "Untitled Breed",
        media,
        subtitle: `${stars}${visibility}`,
      };
    },
  },
});
