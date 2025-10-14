import type { PagebuilderType } from "@/types";

import { RichText } from "../elements/rich-text";

type TextBlockProps = PagebuilderType<"textBlock">;

export function TextBlock({ title, richText, alignment }: TextBlockProps) {
  return (
    <section className="my-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl font-semibold md:text-4xl mb-6">
              {title}
            </h2>
          )}
          <RichText
            richText={richText}
            alignment={alignment as "left" | "center" | "right"}
          />
        </div>
      </div>
    </section>
  );
}
