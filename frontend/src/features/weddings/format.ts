const currency = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const dateFormat = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});
export function formatCurrency(value: string): string { return currency.format(Number(value)); }
export function formatWeddingDate(value: string): string {
  return dateFormat.format(new Date(value + "T12:00:00Z"));
}
export function weddingCountdown(days: number): string {
  if (days === 0) return "To dziś — Wasz dzień!";
  if (days < 0) return "Wasze wesele";
  if (days === 1) return "Już jutro Wasz ślub";
  return `${days} dni do ślubu`;
}
