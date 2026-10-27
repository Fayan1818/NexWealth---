/**
 * Currency and Date Formatter Utilities
 * Strict compliance with NEXWEALTH_DATA_CONTRACT.md (INR / ₹)
 */

export function formatINR(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") {
    return "₹0.00";
  }
  const numericAmount = typeof amount === "number" ? amount : parseFloat(String(amount));
  if (isNaN(numericAmount)) {
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return String(dateStr);
    }
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return String(dateStr);
  }
}
