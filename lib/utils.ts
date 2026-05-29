export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscount(mrp: number, sellingPrice: number): number {
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

export function getGstAmount(price: number, gstPercent: number): number {
  return Math.round((price * gstPercent) / 100);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
