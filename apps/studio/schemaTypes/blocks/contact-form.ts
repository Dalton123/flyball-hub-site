import { Mail } from "lucide-react";
import { defineField, defineType } from "sanity";

import { customRichText } from "../definitions/rich-text";

export const contactForm = defineType({
  name: "contactForm",
  title: "Contact Form",
  type: "object",
  icon: Mail,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Small text above the title to provide context (e.g., 'Get in Touch')",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The main heading for the contact form section",
      validation: (rule) => rule.required(),
    }),
    customRichText(["block"], {
      name: "subTitle",
      title: "Subtitle",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      description: "Text displayed on the submit button",
      initialValue: "Send Message",
    }),
    customRichText(["block"], {
      name: "helperText",
      title: "Helper Text",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "string",
      description: "Message shown after successful form submission",
      initialValue: "Thank you! We'll get back to you soon.",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      subtitle: "Contact Form",
    }),
  },
});
