import { FileText } from "lucide-react";
import { defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";
import { richTextField } from "../common";

export const textBlock = defineType({
  name: "textBlock",
  title: "Text Block",
  icon: FileText,
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional heading for the text block",
    }),
    richTextField,
    defineField({
      name: "alignment",
      type: "string",
      title: "Text Alignment",
      description: "Choose how the text should be aligned on the page",
      initialValue: "left",
      options: createRadioListLayout(["left", "center", "right"], {
        direction: "horizontal",
      }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      alignment: "alignment",
    },
    prepare: ({ title, alignment }) => ({
      title: title || "Text Block",
      subtitle: `Text Block • ${alignment || "left"} aligned`,
    }),
  },
});
