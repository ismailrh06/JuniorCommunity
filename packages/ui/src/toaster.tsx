"use client";

import * as React from "react";

// Minimal Toaster — wraps sonner if available, else a simple state-based impl
// The actual toast() function is re-exported from sonner in apps/web

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let toastItems: ToastItem[] = [];
let nextId = 0;

interface ToastItem {
  id: number;
  message: string;
  type?: "default" | "success" | "error" | "warning";
}

export function toast(message: string, options?: { type?: ToastItem["type"] }) {
  const item: ToastItem = { id: nextId++, message, type: options?.type };
  toastItems = [...toastItems, item];
  toastListeners.forEach((l) => l(toastItems));
  setTimeout(() => {
    toastItems = toastItems.filter((t) => t.id !== item.id);
    toastListeners.forEach((l) => l(toastItems));
  }, 4000);
}

toast.success = (message: string) => toast(message, { type: "success" });
toast.error = (message: string) => toast(message, { type: "error" });

const typeStyles: Record<string, string> = {
  default: "bg-gray-900 text-white",
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-yellow-500 text-gray-900",
};

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm rounded-xl px-4 py-3 text-sm shadow-lg ${
            typeStyles[t.type ?? "default"]
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
