"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import {
  type ContactFormState,
  submitContactForm,
} from "@/actions/contact-form";
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

  // Reset form on successful submission
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <section id="contact" className="px-4 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          {eyebrow && (
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
              {eyebrow}
            </p>
          )}
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg"
            />
          )}
        </div>

        {/* Success Message */}
        {state.success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              {successMessage}
            </p>
          </div>
        )}

        {/* Global Error Message */}
        {state.error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {state.error}
            </p>
          </div>
        )}

        <form
          ref={formRef}
          action={formAction}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
        >
          {/* Name and Email Row */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={isPending}
                className={cn(
                  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors",
                  "placeholder:text-gray-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                  "dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
                  state.errors?.name && "border-red-500 dark:border-red-500",
                )}
                placeholder="Your name"
                aria-invalid={state.errors?.name ? "true" : "false"}
                aria-describedby={state.errors?.name ? "name-error" : undefined}
              />
              {state.errors?.name && (
                <p
                  id="name-error"
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                >
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isPending}
                className={cn(
                  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors",
                  "placeholder:text-gray-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                  "dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
                  state.errors?.email && "border-red-500 dark:border-red-500",
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
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400"
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
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              disabled={isPending}
              className={cn(
                "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors",
                "placeholder:text-gray-400",
                "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                "dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
                state.errors?.subject && "border-red-500 dark:border-red-500",
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
                className="mt-1.5 text-sm text-red-600 dark:text-red-400"
              >
                {state.errors.subject[0]}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              disabled={isPending}
              className={cn(
                "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors",
                "placeholder:text-gray-400",
                "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                "dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
                state.errors?.message && "border-red-500 dark:border-red-500",
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
                className="mt-1.5 text-sm text-red-600 dark:text-red-400"
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
                className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm"
              />
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
