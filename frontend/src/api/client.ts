export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
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
    );
  }
  return data as T;
}
