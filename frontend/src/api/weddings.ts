export interface WeddingCreator {
  id: number;
  username: string;
}

export interface BudgetSummary {
  planned: string;
  spent: string;
  remaining: string;
}

export interface Wedding {
  id: number;
  wedding_date: string;
  city: string;
  guest_count: number;
  planned_budget: string;
  created_by: WeddingCreator;
  created_at: string;
  days_until_wedding: number;
  budget_summary: BudgetSummary;
}

export interface WeddingData {
  wedding_date: string;
  city: string;
  guest_count: number;
  planned_budget: string;
}

interface ApiError {
  detail?: string;
}

const endpoints = {
  create: "/api/weddings/create/",
  current: "/api/weddings/current/",
  edit: "/api/weddings/current/edit/",
  delete: "/api/weddings/current/delete/",
};

function getCookie(name: string): string | null {
  const cookie = document.cookie
    .split(";")
    .find((item) => item.trim().startsWith(`${name}=`));

  return cookie
    ? decodeURIComponent(cookie.trim().substring(name.length + 1))
    : null;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError;
    return data.detail ?? "Wystąpił nieznany błąd.";
  } catch {
    return "Wystąpił błąd komunikacji z serwerem.";
  }
}

async function initializeCsrf(): Promise<string> {
  const response = await fetch("/api/auth/csrf/", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const token = getCookie("csrftoken");

  if (!token) {
    throw new Error("Nie udało się pobrać tokenu CSRF.");
  }

  return token;
}

async function weddingRequest<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  data?: WeddingData,
): Promise<T> {
  const csrfToken = await initializeCsrf();

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
      ...(data && { "Content-Type": "application/json" }),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function createWedding(data: WeddingData): Promise<Wedding> {
  return weddingRequest<Wedding>(endpoints.create, "POST", data);
}

export async function getCurrentWedding(): Promise<Wedding | null> {
  const response = await fetch(endpoints.current, {
    credentials: "include",
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Wedding;
}

export function updateWedding(data: WeddingData): Promise<Wedding> {
  return weddingRequest<Wedding>(endpoints.edit, "PATCH", data);
}

export function deleteWedding(): Promise<void> {
  return weddingRequest<void>(endpoints.delete, "DELETE");
}