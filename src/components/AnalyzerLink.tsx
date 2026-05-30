import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface AnalyzerLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function AnalyzerLink({
  children,
  href = "#analyzer",
  className,
}: AnalyzerLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        `w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold disabled:opacity-40 sm:hover:from-blue-400 sm:hover:to-blue-500 transition-all active:scale-98 sm:active:scale-95 ${className}`,
      )}
    >
      {children}
    </Link>
  );
}
