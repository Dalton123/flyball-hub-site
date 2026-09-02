import { defineField, defineType } from "sanity";

import { createRadioListLayout, isValidUrl } from "../../utils/helper";

const allLinkableTypes = [
  { type: "blog" },
  { type: "blogIndex" },
  { type: "breed" },
  { type: "breedIndex" },
  { type: "organisation" },
  { type: "organisationIndex" },
  { type: "page" },
];

interface AffiliateLinkParent {
  type?: string;
  external?: string;
  isAffiliate?: boolean;
  affiliateProgram?: string;
}

// Shared preview configuration for URL types
const urlPreview = {
  select: {
    externalUrl: "external",
    urlType: "type",
    internalUrl: "internal.slug.current",
    openInNewTab: "openInNewTab",
  },
  prepare({
    externalUrl,
    urlType,
    internalUrl,
    openInNewTab,
  }: {
    externalUrl?: string;
    urlType?: string;
    internalUrl?: string;
    openInNewTab?: boolean;
  }) {
    const url = urlType === "external" ? externalUrl : `/${internalUrl}`;
    const newTabIndicator = openInNewTab ? " ↗" : "";
    const truncatedUrl =
      url && url.length > 30 ? `${url.substring(0, 30)}...` : url;

    return {
      title: `${urlType === "external" ? "External" : "Internal"} Link`,
      subtitle: `${truncatedUrl}${newTabIndicator}`,
    };
  },
};

// Required URL type - used for buttons, navbar links, etc.
export const customUrl = defineType({
  name: "customUrl",
  type: "object",
  description:
    "Configure a link that can point to either an internal page or external website",
  fields: [
    defineField({
      name: "type",
      type: "string",
      description:
        "Choose whether this link points to another page on your site (internal) or to a different website (external)",
      options: createRadioListLayout(["internal", "external"]),
      initialValue: () => "external",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      description:
        "When enabled, clicking this link will open the destination in a new browser tab instead of navigating away from the current page",
      initialValue: () => false,
    }),
    defineField({
      name: "external",
      type: "string",
      title: "URL",
      description:
        "Enter either a full web address (URL) starting with https:// for external sites, or a relative path like /about for internal pages",
      hidden: ({ parent }) => parent?.type !== "external",
      validation: (Rule) => [
        Rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          if (type === "external") {
            if (!value) return "URL can't be empty";
            const isValid = isValidUrl(value);
            if (!isValid) return "Invalid URL";
          }
          return true;
        }),
      ],
    }),
    defineField({
      name: "isAffiliate",
      title: "Affiliate link",
      type: "boolean",
      description:
        "Enable this only when Flyball Hub may earn commission from this link.",
      initialValue: () => false,
      hidden: ({ parent }) => parent?.type !== "external",
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const link = parent as AffiliateLinkParent;
          return value === true && link.type !== "external"
            ? "Affiliate links must use an external URL"
            : true;
        }),
    }),
    defineField({
      name: "affiliateProgram",
      title: "Affiliate programme",
      type: "string",
      options: {
        list: [
          { title: "Awin", value: "awin" },
          { title: "Amazon Associates", value: "amazon" },
          { title: "Direct programme", value: "direct" },
          { title: "Other", value: "other" },
        ],
      },
      hidden: ({ parent }) => !parent?.isAffiliate,
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const link = parent as AffiliateLinkParent;
          return link.isAffiliate && !value
            ? "Select the affiliate programme"
            : true;
        }),
    }),
    defineField({
      name: "affiliateMerchant",
      title: "Affiliate merchant",
      type: "string",
      description: "Use the advertiser name shown by the affiliate programme.",
      hidden: ({ parent }) => !parent?.isAffiliate,
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const link = parent as AffiliateLinkParent;
          return link.isAffiliate && !value?.trim()
            ? "Enter the affiliate merchant"
            : true;
        }),
    }),
    defineField({
      name: "affiliatePlacementId",
      title: "Affiliate placement ID",
      type: "string",
      description:
        "Stable page and placement reference. For Awin, use the same value in clickref.",
      hidden: ({ parent }) => !parent?.isAffiliate,
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const link = parent as AffiliateLinkParent;
          if (!link.isAffiliate) return true;
          if (!value?.trim()) return "Enter a stable affiliate placement ID";
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
            return "Use lowercase letters, numbers and single hyphens only";
          }
          if (link.affiliateProgram === "awin" && link.external) {
            try {
              const clickRef = new URL(link.external).searchParams.get(
                "clickref",
              );
              if (clickRef !== value) {
                return "For Awin links, clickref must match this placement ID";
              }
            } catch {
              return "Enter a valid Awin tracking URL";
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "href",
      type: "string",
      description:
        "Technical field used internally to store the complete URL - you don't need to modify this",
      initialValue: () => "#",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "internal",
      type: "reference",
      description:
        "Select which page on your website this link should point to",
      options: { disableNew: true },
      hidden: ({ parent }) => parent?.type !== "internal",
      to: allLinkableTypes,
      validation: (rule) => [
        rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          if (type === "internal" && !value?._ref)
            return "internal can't be empty";
          return true;
        }),
      ],
    }),
  ],
  preview: urlPreview,
});

// Optional URL type - used when link is truly optional
export const optionalUrl = defineType({
  name: "optionalUrl",
  type: "object",
  description:
    "Configure an optional link that can point to either an internal page or external website",
  fields: [
    defineField({
      name: "type",
      type: "string",
      description:
        "Choose whether this link points to another page on your site (internal) or to a different website (external)",
      options: createRadioListLayout(["internal", "external"]),
      initialValue: () => "external",
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      description:
        "When enabled, clicking this link will open the destination in a new browser tab instead of navigating away from the current page",
      initialValue: () => false,
    }),
    defineField({
      name: "external",
      type: "string",
      title: "URL",
      description:
        "Enter either a full web address (URL) starting with https:// for external sites, or a relative path like /about for internal pages",
      hidden: ({ parent }) => parent?.type !== "external",
      validation: (Rule) => [
        Rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          // Only validate if type is explicitly set to external
          if (type === "external" && value) {
            const isValid = isValidUrl(value);
            if (!isValid) return "Invalid URL";
          }
          return true;
        }),
      ],
    }),
    defineField({
      name: "href",
      type: "string",
      description:
        "Technical field used internally to store the complete URL - you don't need to modify this",
      initialValue: () => "#",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "internal",
      type: "reference",
      description:
        "Select which page on your website this link should point to",
      options: { disableNew: true },
      hidden: ({ parent }) => parent?.type !== "internal",
      to: allLinkableTypes,
    }),
  ],
  preview: urlPreview,
});
