import { Laptop } from "lucide-react";
import { defineField, defineType } from "sanity";

export const macbookScroll = defineType({
  name: "macbookScroll",
  title: "MacBook Scroll",
  type: "object",
  icon: Laptop,
  description:
    "A 3D MacBook that animates on scroll to showcase your app interface",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small text above the title (e.g., 'See It In Action')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for this section",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Optional supporting text below the title",
      rows: 2,
    }),
    defineField({
      name: "screenImage",
      type: "image",
      title: "Screen Image",
      description:
        "Screenshot of your app to display on the MacBook screen (recommended: 1920x1200 or similar 16:10 ratio)",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
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
      name: "showGradient",
      type: "boolean",
      title: "Show Background Gradient",
      description: "Add a subtle gradient background effect",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "screenImage",
    },
    prepare: ({ title, media }) => ({
      title: title || "MacBook Scroll",
      subtitle: "Product showcase with scroll animation",
      media,
    }),
  },
});
