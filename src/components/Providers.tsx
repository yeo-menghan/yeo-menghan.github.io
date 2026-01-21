// src/components/Providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      {children}
      <ClientOnlyProviders />
    </ThemeProvider>
  );
}

function ClientOnlyProviders() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid rendering anything that depends on theme until client is ready
    return null;
  }

  return (
    <>
      <ToastProvider />
      <ThemeColorUpdater />
    </>
  );
}

function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      className="mt-12"
      position="top-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}

function ThemeColorUpdater() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const timerId = setTimeout(() => {
      const bodyStyles = window.getComputedStyle(document.body);
      const backgroundColor = bodyStyles.backgroundColor;

      let metaThemeColor = document.querySelector<HTMLMetaElement>(
        "meta[name='theme-color']"
      );

      if (metaThemeColor) {
        metaThemeColor.content = backgroundColor;
      } else {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.name = "theme-color";
        metaThemeColor.content = backgroundColor;
        document.head.appendChild(metaThemeColor);
      }
    }, 0);

    return () => clearTimeout(timerId);
  }, [resolvedTheme]);

  return null;
}