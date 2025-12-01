import { MessageSquareQuote } from "lucide-react";
import { defineField, defineType } from "sanity";
import { customRichText } from "../definitions/rich-text";

const testimonialCard = defineField({
  name: "testimonialCard",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      type: "text",
      title: "Quote",
      description: "The testimonial text from the customer or team",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorName",
      type: "string",
      title: "Author Name",
      description: "Name of the person giving the testimonial",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorRole",
      type: "string",
      title: "Author Role",
      description: "Job title, team name, or role (e.g., 'Team Captain, Flyball Fanatics')",
    }),
    defineField({
      name: "authorImage",
      type: "image",
      title: "Author Image",
      description: "Photo of the person or team logo",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "rating",
      type: "number",
      title: "Rating",
      description: "Star rating from 1-5 (optional)",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "quote",
      media: "authorImage",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled",
      subtitle: subtitle ? `"${subtitle.slice(0, 60)}..."` : "",
    }),
  },
});

export const testimonials = defineType({
  name: "testimonials",
  title: "Testimonials",
  type: "object",
  icon: MessageSquareQuote,
  description: "Display customer testimonials with quotes, author info, and optional ratings",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small text above the main title (e.g., 'What Teams Are Saying')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for the testimonials section",
    }),
    customRichText(["block"]),
    defineField({
      name: "testimonials",
      type: "array",
      title: "Testimonials",
      description: "Add testimonials from your customers or team members",
      of: [testimonialCard],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Testimonials",
      subtitle: "Testimonials Section",
    }),
  },
});
