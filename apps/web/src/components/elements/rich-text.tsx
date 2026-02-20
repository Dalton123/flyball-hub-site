"use client";
import { cn } from "@workspace/ui/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "next-sanity";

import { parseChildrenToSlug } from "@/utils";

// Skeleton for code block loading state
function CodeBlockSkeleton({ filename }: { filename?: string }) {
  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border">
      {filename && (
        <div className="bg-muted px-4 py-2 text-sm text-muted-foreground font-mono border-b border-border">
          {filename}
        </div>
      )}
      <div className="bg-[#282c34] p-4">
        <div className="space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </figure>
  );
}

// Lazy-loaded code block component wrapper 
const LazyCodeBlock = dynamic(
  () => import("./code-block").then((mod) => mod.CodeBlock),
  {
    ssr: false,
    loading: () => <CodeBlockSkeleton />,
  },
);

import { SanityImage } from "./sanity-image";

// Helper to parse highlight lines (e.g., "1,3,5-7" -> [1, 3, 5, 6, 7])
function parseHighlightLines(input?: string): number[] {
  if (!input) return [];
  const lines: number[] = [];
  input.split(",").forEach((part) => {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = Number(startStr);
      const end = Number(endStr);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) lines.push(i);
      }
    } else {
      const num = Number(trimmed);
      if (!isNaN(num)) lines.push(num);
    }
  });
  return lines;
}

const components: Partial<PortableTextReactComponents> = {
  block: {
    h1: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h2
          id={slug}
          className="scroll-m-20 border-b pb-2 text-4xl font-semibold first:mt-0"
        >
          {children}
        </h2>
      );
    },
    h2: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h2
          id={slug}
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h3 id={slug} className="scroll-m-20 text-2xl font-semibold">
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h4 id={slug} className="scroll-m-20 text-xl font-semibold">
          {children}
        </h4>
      );
    },
    h5: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h5 id={slug} className="scroll-m-20 text-lg font-semibold">
          {children}
        </h5>
      );
    },
    h6: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h6 id={slug} className="scroll-m-20 text-base font-semibold">
          {children}
        </h6>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded-md border border-white/10 bg-opacity-5 p-1 text-sm lg:whitespace-nowrap">
        {children}
      </code>
    ),
    "strike-through": ({ children }) => (
      <del className="line-through">{children}</del>
    ),
    link: ({ children, value }) => {
      if (!value?.href || value.href === "#") {
        return <span>{children}</span>;
      }
      const isExternal =
        value.href.startsWith("http") && !value.href.includes("flyballhub.com");
      return (
        <Link
          className="text-primary underline decoration-primary/40 decoration-2 underline-offset-2 transition-all duration-200 hover:decoration-primary hover:decoration-[3px]"
          href={value.href}
          prefetch={false}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </Link>
      );
    },
    customLink: ({ children, value }) => {
      if (!value.href || value.href === "#") {
        console.warn("🚀 link is not set", value);
        return (
          <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
            Link Broken
          </span>
        );
      }
      return (
        <Link
          className="text-primary underline decoration-primary/40 decoration-2 underline-offset-2 transition-all duration-200 hover:decoration-primary hover:decoration-[3px]"
          href={value.href}
          prefetch={false}
          target={value.openInNewTab ? "_blank" : "_self"}
          rel={value.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.id) return null;
      return (
        <figure className="my-4">
          <SanityImage
            image={value}
            alt={value?.alt || "Image"}
            className="h-auto rounded-lg w-full"
            width={1600}
            height={900}
          />
          {value?.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    break: ({ value }) => {
      const styleClasses = {
        default: "border-t border-border",
        dashed: "border-t border-dashed border-border",
        subtle: "border-t border-muted-foreground/20",
      };
      return (
        <hr
          className={cn(
            "my-8",
            styleClasses[value?.style as keyof typeof styleClasses] ||
              styleClasses.default,
          )}
        />
      );
    },
    blockquote: ({ value }) => {
      if (!value?.quote) return null;
      return (
        <figure className="my-8 border-l-4 border-primary pl-6 py-2">
          <blockquote className="text-lg italic text-muted-foreground">
            &ldquo;{value.quote}&rdquo;
          </blockquote>
          {(value.attribution || value.source) && (
            <figcaption className="mt-2 text-sm text-muted-foreground">
              {value.attribution && (
                <span className="font-medium">{value.attribution}</span>
              )}
              {value.attribution && value.source && <span> — </span>}
              {value.source && <cite>{value.source}</cite>}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => {
      if (!value?.code) return null;

      const highlightLines = parseHighlightLines(value.highlightLines);

      return (
        <LazyCodeBlock
          code={value.code}
          language={value.language || "text"}
          filename={value.filename}
          highlightLines={highlightLines}
        />
      );
    },
    table: ({ value }) => {
      if (!value?.rows?.length) return null;

      type TableRow = {
        _key?: string;
        cells?: string[];
      };

      const rows = value.rows as TableRow[];
      const [headerRow, ...bodyRows] = rows;

      return (
        <div className="not-prose my-6 overflow-x-auto max-w-[calc(100dvw-90px)] md:max-w-[calc(100dvw-100px)] xl:max-w-full">
          <table
            className="border-collapse border border-border text-sm md:text-base"
            style={{ width: "max-content", minWidth: "100%" }}
          >
            {headerRow && (
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {headerRow.cells?.map((cell, cellIndex) => (
                    <th
                      key={`header-${cellIndex}`}
                      className="border border-border p-1! md:p-3! text-left font-semibold whitespace-nowrap"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr
                  key={row._key || rowIndex}
                  className="border-b border-border"
                >
                  {row.cells?.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="border border-border p-1! md:p-3! text-left whitespace-nowrap"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
  hardBreak: () => <br />,
};

type TextAlignment = "left" | "center" | "right";

export function RichText<T>({
  richText,
  className,
  alignment = "left",
}: {
  richText?: T | null;
  className?: string;
  alignment?: TextAlignment;
}) {
  if (!richText) return null;

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  return (
    <div
      className={cn(
        // Base prose styles
        "prose max-w-none",
        // Responsive sizing
        "prose-base md:prose-lg",
        // Heading styles
        "prose-headings:scroll-m-24 prose-headings:font-semibold",
        "prose-h2:border-b prose-h2:pb-2 prose-h2:first:mt-0",
        // Link styles
        "prose-a:text-primary prose-a:decoration-primary/40 prose-a:decoration-2 prose-a:underline-offset-2 prose-a:transition-all hover:prose-a:decoration-primary hover:prose-a:decoration-[3px]",
        // List styles
        "prose-li:leading-7",
        // Code styles
        "prose-code:rounded-md prose-code:border prose-code:px-1 prose-code:py-0.5",
        // Image styles
        "prose-img:rounded-lg",
        // Alignment
        alignmentClass,
        // Custom overrides
        className,
      )}
    >
      <PortableText
        value={richText as unknown as PortableTextBlock[]}
        components={components}
        onMissingComponent={(_, { nodeType, type }) =>
          console.log("missing component", nodeType, type)
        }
      />
    </div>
  );
}
