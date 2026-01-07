import { Play } from "lucide-react";
import { defineField, defineType } from "sanity";

export const videoSection = defineType({
  name: "videoSection",
  title: "Video Section",
  type: "object",
  icon: Play,
  description: "Full-width video embed section (YouTube or Vimeo)",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Optional small text above the title",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional heading for the video section",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Optional text below the title",
      rows: 2,
    }),
    defineField({
      name: "videoUrl",
      type: "url",
      title: "Video URL",
      description: "YouTube or Vimeo video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "posterImage",
      type: "image",
      title: "Poster Image",
      description: "Optional thumbnail shown before video plays (improves LCP)",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe this image for screen readers",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      videoUrl: "videoUrl",
      media: "posterImage",
    },
    prepare: ({ title, videoUrl, media }) => ({
      title: title || "Video Section",
      subtitle: videoUrl || "No video URL set",
      media,
    }),
  },
});
