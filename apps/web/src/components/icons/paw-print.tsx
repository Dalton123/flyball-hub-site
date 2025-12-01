import { cn } from "@workspace/ui/lib/utils";

interface PawPrintProps {
  className?: string;
  size?: number;
}

export function PawPrint({ className, size = 24 }: PawPrintProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      {/* Main pad */}
      <ellipse cx="12" cy="16" rx="4" ry="3.5" fill="currentColor" />

      {/* Top left toe */}
      <ellipse cx="7" cy="9" rx="2" ry="2.5" fill="currentColor" />

      {/* Top right toe */}
      <ellipse cx="17" cy="9" rx="2" ry="2.5" fill="currentColor" />

      {/* Middle left toe */}
      <ellipse cx="9" cy="6" rx="1.8" ry="2.2" fill="currentColor" />

      {/* Middle right toe */}
      <ellipse cx="15" cy="6" rx="1.8" ry="2.2" fill="currentColor" />
    </svg>
  );
}
