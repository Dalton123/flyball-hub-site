"use client";

import { Button } from "@workspace/ui/components/button";
import { ChevronRight, LoaderCircle } from "lucide-react";
import Form from "next/form";
import { useFormStatus } from "react-dom";

import type { PagebuilderType } from "@/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

import { BackgroundPattern } from "../elements/background-pattern";
import { RichText } from "../elements/rich-text";

type SubscribeNewsletterProps = PagebuilderType<"subscribeNewsletter">;

function SubscribeNewsletterButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      size="icon"
      type="submit"
      disabled={pending}
      className="size-9 aspect-square bg-primary hover:bg-primary/90 rounded-lg"
      aria-label={pending ? "Subscribing..." : "Subscribe to newsletter"}
    >
      <span className="flex items-center justify-center gap-2">
        {pending ? (
          <LoaderCircle
            className="animate-spin text-primary-foreground"
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            className="text-primary-foreground"
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </span>
    </Button>
  );
}

export function SubscribeNewsletter({
  title,
  subTitle,
  helperText,
}: SubscribeNewsletterProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} id="subscribe" className="px-4 py-8 sm:py-12 md:py-16">
      <div className="relative container mx-auto px-4 md:px-8 py-12 sm:py-20 md:py-28 lg:py-32 bg-gradient-to-br from-accent to-muted rounded-3xl overflow-hidden">
        {/* Paw prints background pattern */}
        <BackgroundPattern pattern="paw-prints" opacity={0.06} />

        <div
          className={`relative z-10 mx-auto text-center max-w-2xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mb-8 text-sm text-muted-foreground sm:mb-10 text-balance sm:text-base max-w-xl mx-auto"
            />
          )}
          <Form
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2"
            action={() => {}}
          >
            <div className="flex bg-background items-center border border-border/50 rounded-xl p-2 shadow-lg md:w-[28rem] justify-between pl-4 transition-shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-primary/20">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="rounded-e-none border-e-0 focus-visible:ring-0 outline-none bg-transparent w-full text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
              />
              <SubscribeNewsletterButton />
            </div>
          </Form>
          {helperText && (
            <RichText
              richText={helperText}
              className="mt-4 text-xs text-muted-foreground sm:mt-5 sm:text-sm"
            />
          )}
        </div>
      </div>
    </section>
  );
}
