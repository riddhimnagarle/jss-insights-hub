import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  websiteUrl?: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

function logoDevUrl(websiteUrl?: string): string | null {
  const key = import.meta.env["VITE_LOGO_DEV_PUBLISHABLE_KEY"] as string | undefined;
  if (!key || !websiteUrl) return null;
  try {
    const domain = new URL(websiteUrl).hostname.replace(/^www\./, "");
    return `https://img.logo.dev/${domain}?token=${key}&size=128&format=png`;
  } catch {
    return null;
  }
}

export function CompanyLogo({
  name,
  websiteUrl,
  logoUrl,
  size = 40,
  className,
}: CompanyLogoProps) {
  const candidates = [logoDevUrl(websiteUrl), logoUrl].filter(Boolean) as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [websiteUrl, logoUrl]);

  const src = candidates[index];

  if (!src) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-secondary font-heading font-semibold text-foreground",
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setIndex((i) => i + 1)}
      className={cn(
        "shrink-0 rounded-lg border border-border bg-card object-contain p-1",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
