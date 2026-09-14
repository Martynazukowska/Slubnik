export interface UserProfile {
  partner_name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password_repeat: string;
}

interface ApiErrorResponse {
  detail?: string;
  code?: string;
}

function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

async function parseErrorResponse(
  response: Response,
): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse;

    return data.detail ?? "Wystąpił nieznany błąd.";
  } catch {
    return "Wystąpił błąd komunikacji z serwerem.";
  }
}

export async function initializeCsrf(): Promise<void> {
  const response = await fetch("/api/auth/csrf/", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorResponse(response),
    );
  }
}

export async function login({
  username,
  password,
}: LoginCredentials): Promise<User> {
  await initializeCsrf();

  const csrfToken = getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error(
      "Nie udało się pobrać tokenu CSRF.",
    );
  }

  const response = await fetch("/api/auth/login/", {
    method: "POST",
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },

    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorResponse(response),
    );
  }

  return (await response.json()) as User;
}

export async function register({
  username,
  email,
  password,
  password_repeat,
}: RegisterCredentials): Promise<void> {
  await initializeCsrf();

  const csrfToken = getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error(
      "Nie udało się pobrać tokenu CSRF.",
    );
  }

  const response = await fetch("/api/auth/register/", {
    method: "POST",
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },

    body: JSON.stringify({
      username,
      email,
      password,
      password_repeat,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorResponse(response),
    );
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch("/api/auth/me/", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorResponse(response),
    );
  }

  return (await response.json()) as User;
}

export async function logout(): Promise<void> {
  await initializeCsrf();

  const csrfToken = getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error(
      "Nie udało się pobrać tokenu CSRF.",
    );
  }

  const response = await fetch("/api/auth/logout/", {
    method: "POST",
    credentials: "include",

    headers: {
      "X-CSRFToken": csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorResponse(response),
    );
  }
}