"use client";

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

import { RichText } from "../elements/rich-text";

type FaqAccordionProps = PagebuilderType<"faqAccordion">;

export function FaqAccordion({
  eyebrow,
  title,
  subtitle,
  faqs,
  link,
}: FaqAccordionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} id="faq" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`flex w-full flex-col items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow && (
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base md:text-lg font-normal text-muted-foreground text-balance max-w-2xl">
                {subtitle}
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
                  {faq?.title}
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
                {link?.title}
              </p>
              <Link
                href={link.href ?? "#"}
                target={link.openInNewTab ? "_blank" : "_self"}
                className="inline-flex items-center gap-2 group/link text-foreground hover:text-primary transition-colors"
              >
                <span className="text-base font-medium leading-6">
                  {link?.description}
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
