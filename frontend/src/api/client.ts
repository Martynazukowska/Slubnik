export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;
  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function csrfCookie(): string | undefined {
  const cookie = document.cookie.split("; ").find((item) => item.startsWith("csrftoken="));
  return cookie ? decodeURIComponent(cookie.slice("csrftoken=".length)) : undefined;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method ?? "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    if (!csrfCookie()) await apiRequest("/auth/csrf/");
    const token = csrfCookie();
    if (!token) throw new Error("Nie udało się pobrać tokenu CSRF.");
    headers.set("X-CSRFToken", token);
  }
  if (options.body) headers.set("Content-Type", "application/json");
  const response = await fetch("/api" + path, { ...options, headers, credentials: "include" });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      typeof data?.detail === "string" ? data.detail : "Błąd komunikacji z serwerem.",
      response.status,
      parseFieldErrors(data?.errors),
    );
  }
  return data as T;
}

function parseFieldErrors(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([field, errors]) => [
    field, Array.isArray(errors) ? errors.flatMap((error: unknown) => {
      if (typeof error === "string") return [error];
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return [error.message];
      return [];
    }) : [],
  ]));
}
