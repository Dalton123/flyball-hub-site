import {
  BlockquoteIcon,
  CodeIcon,
  ImageIcon,
  LinkIcon,
} from "@sanity/icons";
import { Minus } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

const richTextMembers = [
  defineArrayMember({
    name: "block",
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H1", value: "h1" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
      { title: "H5", value: "h5" },
      { title: "H6", value: "h6" },
      { title: "Inline", value: "inline" },
    ],
    lists: [
      { title: "Numbered", value: "number" },
      { title: "Bullet", value: "bullet" },
    ],
    marks: {
      annotations: [
        {
          name: "customLink",
          type: "object",
          title: "Internal/External Link",
          icon: LinkIcon,
          fields: [
            defineField({
              name: "customLink",
              type: "customUrl",
            }),
          ],
        },
      ],
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
        { title: "Code", value: "code" },
        { title: "Strikethrough", value: "strike-through" },
      ],
    },
  }),
  defineArrayMember({
    name: "image",
    title: "Image",
    type: "image",
    icon: ImageIcon,
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
      defineField({
        name: "caption",
        type: "string",
        title: "Caption Text",
      }),
    ],
  }),
  defineArrayMember({
    name: "break",
    type: "object",
    title: "Horizontal Rule",
    icon: Minus,
    fields: [
      defineField({
        name: "style",
        type: "string",
        title: "Style",
        description: "Choose the visual style for this divider",
        options: {
          list: [
            { title: "Default", value: "default" },
            { title: "Dashed", value: "dashed" },
            { title: "Subtle", value: "subtle" },
          ],
        },
        initialValue: "default",
      }),
    ],
    preview: {
      prepare() {
        return { title: "Horizontal Rule" };
      },
    },
  }),
  defineArrayMember({
    name: "blockquote",
    type: "object",
    title: "Blockquote",
    icon: BlockquoteIcon,
    fields: [
      defineField({
        name: "quote",
        type: "text",
        title: "Quote",
        description: "The quoted text content",
        rows: 3,
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "attribution",
        type: "string",
        title: "Attribution",
        description: "Who said this quote (optional)",
      }),
      defineField({
        name: "source",
        type: "string",
        title: "Source",
        description: "Where the quote is from, e.g., book title, article (optional)",
      }),
    ],
    preview: {
      select: {
        quote: "quote",
        attribution: "attribution",
      },
      prepare({ quote, attribution }) {
        return {
          title: quote?.substring(0, 50) + (quote?.length > 50 ? "..." : ""),
          subtitle: attribution ? `— ${attribution}` : "Blockquote",
        };
      },
    },
  }),
  defineArrayMember({
    name: "codeBlock",
    type: "object",
    title: "Code Block",
    icon: CodeIcon,
    fields: [
      defineField({
        name: "code",
        type: "text",
        title: "Code",
        description: "Paste or type your code here",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "language",
        type: "string",
        title: "Language",
        description: "Select the programming language for syntax highlighting",
        options: {
          list: [
            { title: "JavaScript", value: "javascript" },
            { title: "TypeScript", value: "typescript" },
            { title: "JSX", value: "jsx" },
            { title: "TSX", value: "tsx" },
            { title: "HTML", value: "html" },
            { title: "CSS", value: "css" },
            { title: "JSON", value: "json" },
            { title: "Markdown", value: "markdown" },
            { title: "Bash/Shell", value: "bash" },
            { title: "Python", value: "python" },
            { title: "SQL", value: "sql" },
            { title: "GraphQL", value: "graphql" },
            { title: "YAML", value: "yaml" },
            { title: "Plain Text", value: "text" },
          ],
        },
        initialValue: "javascript",
      }),
      defineField({
        name: "filename",
        type: "string",
        title: "Filename",
        description: "Optional filename to display above the code block",
      }),
      defineField({
        name: "highlightLines",
        type: "string",
        title: "Highlight Lines",
        description: "Comma-separated line numbers to highlight, e.g., '1,3,5-7'",
      }),
    ],
    preview: {
      select: {
        language: "language",
        filename: "filename",
        code: "code",
      },
      prepare({ language, filename, code }) {
        return {
          title: filename || "Code Block",
          subtitle: `${language || "text"} • ${code?.split("\n").length || 0} lines`,
        };
      },
    },
  }),
  defineArrayMember({
    type: "table",
  }),
];

export const richText = defineType({
  name: "richText",
  type: "array",
  of: richTextMembers,
});

export const memberTypes = richTextMembers.map((member) => member.name);

type Type = NonNullable<(typeof memberTypes)[number]>;

export const customRichText = (
  type: Type[],
  options?: { name?: string; title?: string; group?: string },
) => {
  const { name } = options ?? {};
  const customMembers = richTextMembers.filter(
    (member) => member.name && type.includes(member.name),
  );
  return defineField({
    ...options,
    name: name ?? "richText",
    type: "array",
    of: customMembers,
  });
};
