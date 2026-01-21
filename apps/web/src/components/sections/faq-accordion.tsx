"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { PagebuilderType } from "@/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cleanText } from "@/utils";

import { RichText } from "../elements/rich-text";

type FaqAccordionProps = PagebuilderType<"faqAccordion">;

/**
 * Convert Portable Text blocks to plain text for JSON-LD schema
 */
function portableTextToPlainText(blocks: unknown[] | null | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .filter(
      (block): block is { _type: string; children?: { text?: string }[] } =>
        typeof block === "object" &&
        block !== null &&
        "_type" in block &&
        block._type === "block"
    )
    .map((block) =>
      block.children?.map((child) => child.text || "").join("") || ""
    )
    .join(" ")
    .trim();
}

export function FaqAccordion({
  eyebrow,
  title,
  subtitle,
  faqs,
  link,
}: FaqAccordionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  // Generate JSON-LD FAQ schema for SEO
  const faqSchema = useMemo(() => {
    if (!faqs?.length) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs
        .filter((faq) => faq?.title && faq?.richText)
        .map((faq) => ({
          "@type": "Question",
          name: cleanText(faq.title),
          acceptedAnswer: {
            "@type": "Answer",
            text: portableTextToPlainText(faq.richText),
          },
        })),
    };

    return JSON.stringify(schema);
  }, [faqs]);

  return (
    <section ref={ref} id="faq" className="">
      {/* JSON-LD FAQ Schema for SEO */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      )}
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`flex w-full flex-col items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium"
              >
                {cleanText(eyebrow)}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                {cleanText(title)}
              </h2>
            )}
            {subtitle && (
              <p className="text-base md:text-lg font-normal text-muted-foreground text-balance max-w-2xl">
                {cleanText(subtitle)}
              </p>
            )}
          </div>
        </div>
        <div
          className={`mt-10 lg:mt-16 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-3"
            defaultValue={faqs?.[0]?._id}
          >
            {faqs?.map((faq, index) => (
              <AccordionItem
                value={faq?._id}
                key={`AccordionItem-${faq?._id}-${index}`}
                className="border border-border/60 rounded-xl px-5 py-1 bg-card/50 hover:bg-card transition-colors data-[state=open]:bg-card data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="py-4 text-base font-medium leading-6 hover:no-underline group text-left">
                  {cleanText(faq?.title)}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  <RichText
                    richText={faq?.richText ?? []}
                    className="text-sm md:text-base"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {link?.href && (
            <div className="w-full pt-8 mt-4 border-t border-border/40">
              <p className="mb-2 text-xs text-muted-foreground uppercase tracking-wide">
                {cleanText(link?.title)}
              </p>
              <Link
                href={link.href ?? "#"}
                target={link.openInNewTab ? "_blank" : "_self"}
                className="inline-flex items-center gap-2 group/link text-foreground hover:text-primary transition-colors"
              >
                <span className="text-base font-medium leading-6">
                  {cleanText(link?.description)}
                </span>
                <span className="rounded-full border border-border group-hover/link:border-primary group-hover/link:bg-primary p-1.5 transition-colors">
                  <ArrowUpRight
                    size={14}
                    className="text-muted-foreground group-hover/link:text-primary-foreground transition-colors"
                  />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
