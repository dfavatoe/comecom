"use client";

import { ToastProvider } from "@/hooks/useToast";
import { SessionProvider } from "next-auth/react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
