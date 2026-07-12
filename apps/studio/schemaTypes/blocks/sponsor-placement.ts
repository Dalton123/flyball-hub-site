import { MegaphoneIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const sponsorPlacement = defineType({
  name: "sponsorPlacement",
  title: "Sponsor Placement",
  type: "object",
  icon: MegaphoneIcon,
  description:
    "Add a clearly labelled sponsor campaign at this exact position on the page.",
  fields: [
    defineField({
      name: "sponsor",
      title: "Sponsor Campaign",
      type: "reference",
      to: [{ type: "sponsor" }],
      options: { disableNew: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "placementId",
      title: "Placement ID",
      type: "string",
      description: "Stable analytics label, for example homepage-mid-page.",
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          name: "lowercase kebab-case",
        }),
    }),
  ],
  preview: {
    select: {
      sponsorName: "sponsor.name",
      placementId: "placementId",
      media: "sponsor.desktopImage",
    },
    prepare({ sponsorName, placementId, media }) {
      return {
        title: sponsorName || "Select a sponsor campaign",
        subtitle: placementId || "Sponsor placement",
        media,
      };
    },
  },
});
