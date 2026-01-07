import { Newspaper } from "lucide-react";
import { defineField, defineType } from "sanity";

export const latestPosts = defineType({
  name: "latestPosts",
  title: "Latest Posts",
  type: "object",
  icon: Newspaper,
  description: "Display the most recent blog posts",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small text above the main title (e.g., 'From the Blog')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for the section",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Optional text below the title",
      rows: 2,
    }),
    defineField({
      name: "postsCount",
      type: "number",
      title: "Number of Posts",
      description: "How many posts to display (default: 3)",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(6).integer(),
    }),
    defineField({
      name: "showViewAll",
      type: "boolean",
      title: "Show 'View All' Link",
      description: "Display a link to the full blog index",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      postsCount: "postsCount",
    },
    prepare: ({ title, postsCount }) => ({
      title: title || "Latest Posts",
      subtitle: `Showing ${postsCount || 3} recent posts`,
    }),
  },
});
