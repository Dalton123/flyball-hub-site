import { MapPinIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const teamFinder = defineType({
  name: "teamFinder",
  title: "Team Finder",
  type: "object",
  icon: MapPinIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small text above the title (optional)",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading, e.g. 'Find a Team Near You'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Supporting text below the title",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search Placeholder",
      type: "string",
      description: "Placeholder text for the search input",
      initialValue: "Enter your city or postcode...",
    }),
    defineField({
      name: "noResultsMessage",
      title: "No Results Message",
      type: "string",
      description: "Message shown when no teams are found or API unavailable",
      initialValue: "No teams found. Try a different location.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
    },
    prepare: ({ title, eyebrow }) => ({
      title: title || "Team Finder",
      subtitle: eyebrow || "Search teams by location",
    }),
  },
});
