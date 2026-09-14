export interface WeddingFields {
  wedding_date: string;
  city: string;
  guest_count: string;
  planned_budget: string;
}

export type WeddingErrors = Partial<Record<keyof WeddingFields, string>>;

const MAX_GUESTS = 2147483647;
const BUDGET_PATTERN = /^\d{1,10}(?:\.\d{1,2})?$/;

export function weddingToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function minimumWeddingDate(now = new Date()): string {
  const date = new Date(`${weddingToday(now)}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
}

export function normalizeBudget(value: string): string {
  return value.trim().replace(/\s/g, "").replace(",", ".");
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T12:00:00Z`);

  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function validGuests(value: string): boolean {
  if (!/^\d+$/.test(value)) return false;

  const count = Number(value);

  return Number.isInteger(count) && count >= 1 && count <= MAX_GUESTS;
}

function validBudget(value: string): boolean {
  const budget = normalizeBudget(value);

  if (!BUDGET_PATTERN.test(budget)) return false;

  const [whole, decimal = ""] = budget.split(".");

  return Number(whole) > 0 || Number(decimal) > 0;
}

export function validateWedding(
  values: WeddingFields,
  now = new Date(),
): WeddingErrors {
  const errors: WeddingErrors = {};
  const city = values.city.trim();

  if (!validDate(values.wedding_date)) {
    errors.wedding_date = "Podaj poprawną datę ślubu.";
  } else if (values.wedding_date < minimumWeddingDate(now)) {
    errors.wedding_date = "Data ślubu musi być późniejsza niż dzisiaj.";
  }

  if (!city) {
    errors.city = "Podaj miasto.";
  } else if (city.length > 150) {
    errors.city = "Miasto może mieć maksymalnie 150 znaków.";
  }

  if (!validGuests(values.guest_count)) {
    errors.guest_count =
      "Podaj całkowitą liczbę gości od 1 do 2 147 483 647.";
  }

  if (!validBudget(values.planned_budget)) {
    errors.planned_budget =
      "Podaj kwotę od 0,01 do 9 999 999 999,99 zł, maksymalnie z 2 cyframi po przecinku.";
  }

  return errors;
}