import { cn } from "@workspace/ui/lib/utils";

interface TennisBallProps {
  className?: string;
  size?: number;
}

export function TennisBall({ className, size = 24 }: TennisBallProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-secondary", className)}
      aria-hidden="true"
    >
      {/* Ball background */}
      <circle cx="12" cy="12" r="11" fill="currentColor" />

      {/* Curved seam lines */}
      <path
        d="M4.5 6C6.5 8 6.5 16 4.5 18"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19.5 6C17.5 8 17.5 16 19.5 18"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
