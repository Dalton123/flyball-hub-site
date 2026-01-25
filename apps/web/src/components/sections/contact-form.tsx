"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import {
  type ContactFormState,
  submitContactForm,
} from "@/actions/contact-form";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { ContactForm as ContactFormType } from "@/lib/sanity/sanity.types";

import { RichText } from "../elements/rich-text";

type ContactFormProps = ContactFormType;

export function ContactForm({
  eyebrow,
  title,
  subTitle,
  buttonText = "Send Message",
  helperText,
  successMessage = "Thank you! We'll get back to you soon.",
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactForm, {});

  const formRef = useRef<HTMLFormElement>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  // Reset form on successful submission
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <section ref={ref} id="contact" className="px-4 py-12">
      <div className="container mx-auto max-w-3xl">
        <div
          className={`mb-10 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {eyebrow && (
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-sm font-medium"
            >
              {eyebrow}
            </Badge>
          )}
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg text-center"
            />
          )}
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Success Message */}
          {state.success && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              <p className="text-sm font-medium text-success">
                {successMessage}
              </p>
            </div>
          )}

          {/* Global Error Message */}
          {state.error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">
                {state.error}
              </p>
            </div>
          )}

          <form
            ref={formRef}
            action={formAction}
            className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            {/* Name and Email Row */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={isPending}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    state.errors?.name && "border-destructive",
                  )}
                  placeholder="Your name"
                  aria-invalid={state.errors?.name ? "true" : "false"}
                  aria-describedby={
                    state.errors?.name ? "name-error" : undefined
                  }
                />
                {state.errors?.name && (
                  <p
                    id="name-error"
                    className="mt-1.5 text-sm text-destructive"
                  >
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={isPending}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    state.errors?.email && "border-destructive",
                  )}
                  placeholder="your@email.com"
                  aria-invalid={state.errors?.email ? "true" : "false"}
                  aria-describedby={
                    state.errors?.email ? "email-error" : undefined
                  }
                />
                {state.errors?.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-sm text-destructive"
                  >
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                disabled={isPending}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground transition-colors",
                  "placeholder:text-muted-foreground",
                  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  state.errors?.subject && "border-destructive",
                )}
                placeholder="How can we help?"
                aria-invalid={state.errors?.subject ? "true" : "false"}
                aria-describedby={
                  state.errors?.subject ? "subject-error" : undefined
                }
              />
              {state.errors?.subject && (
                <p
                  id="subject-error"
                  className="mt-1.5 text-sm text-destructive"
                >
                  {state.errors.subject[0]}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                disabled={isPending}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground transition-colors",
                  "placeholder:text-muted-foreground",
                  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  state.errors?.message && "border-destructive",
                )}
                placeholder="Tell us more about your inquiry..."
                aria-invalid={state.errors?.message ? "true" : "false"}
                aria-describedby={
                  state.errors?.message ? "message-error" : undefined
                }
              />
              {state.errors?.message && (
                <p
                  id="message-error"
                  className="mt-1.5 text-sm text-destructive"
                >
                  {state.errors.message[0]}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg sm:w-auto"
                size="lg"
              >
                {isPending ? (
                  <>
                    <LoaderCircle
                      className="mr-2 animate-spin"
                      size={18}
                      aria-hidden="true"
                    />
                    Sending...
                  </>
                ) : (
                  buttonText
                )}
              </Button>

              {helperText && (
                <RichText
                  richText={helperText}
                  className="text-xs text-muted-foreground sm:text-sm"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
