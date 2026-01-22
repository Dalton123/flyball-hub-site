"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  highlightLines = [],
}: CodeBlockProps) {
  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border">
      {filename && (
        <div className="bg-muted px-4 py-2 text-sm text-muted-foreground font-mono border-b border-border">
          {filename}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => ({
          style: {
            backgroundColor: highlightLines.includes(lineNumber)
              ? "rgba(255, 255, 0, 0.1)"
              : undefined,
          },
        })}
        customStyle={{
          margin: 0,
          borderRadius: filename ? 0 : "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </figure>
  );
}
