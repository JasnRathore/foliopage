"use client";

import { useEffect } from "react";

interface DynamicFaviconProps {
  href: string;
}

export function DynamicFavicon({ href }: DynamicFaviconProps) {
  useEffect(() => {
    if (!href) return;

    let icon = document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][data-dynamic-favicon="true"]',
    );

    if (!icon) {
      icon = document.createElement("link");
      icon.setAttribute("rel", "icon");
      icon.setAttribute("data-dynamic-favicon", "true");
      document.head.appendChild(icon);
    }

    icon.setAttribute("href", href);
  }, [href]);

  return null;
}
