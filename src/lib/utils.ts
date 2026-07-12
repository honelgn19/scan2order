import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(ts: any): string {
  if (!ts && ts !== 0) return "N/A";

  try {
    // Firestore Timestamp has toDate()
    if (typeof ts?.toDate === "function") {
      return ts.toDate().toLocaleString();
    }

    // plain object with seconds
    if (ts && typeof ts === "object" && typeof ts.seconds === "number") {
      return new Date(ts.seconds * 1000).toLocaleString();
    }

    if (typeof ts === "string") {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return d.toLocaleString();
      return ts;
    }

    if (typeof ts === "number") {
      // assume milliseconds
      return new Date(ts).toLocaleString();
    }

    if (ts instanceof Date) return ts.toLocaleString();

    return String(ts);
  } catch (err) {
    return "N/A";
  }
}
