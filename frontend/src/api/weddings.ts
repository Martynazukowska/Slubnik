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

export interface CreateWeddingData {
  wedding_date: string;
  city: string;
  guest_count: number;
  planned_budget: string;
}

export interface UpdateWeddingData {
  wedding_date: string;
  city: string;
  guest_count: number;
  planned_budget: string;
}

interface ApiError {
  detail?: string;
}


function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] =
      cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(
        valueParts.join("="),
      );
    }
  }

  return null;
}


async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const data =
      (await response.json()) as ApiError;

    return (
      data.detail ??
      "Wystąpił nieznany błąd."
    );
  } catch {
    return (
      "Wystąpił błąd komunikacji z serwerem."
    );
  }
}


async function initializeCsrf(): Promise<void> {
  const response = await fetch(
    "/api/auth/csrf/",
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }
}


export async function createWedding(
  data: CreateWeddingData,
): Promise<Wedding> {
  await initializeCsrf();

  const csrfToken =
    getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error(
      "Nie udało się pobrać tokenu CSRF.",
    );
  }

  const response = await fetch(
    "/api/weddings/create/",
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },

      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as Wedding;
}


export async function getCurrentWedding():
Promise<Wedding | null> {
  const response = await fetch(
    "/api/weddings/current/",
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as Wedding;
}


export async function updateWedding(
  data: UpdateWeddingData,
): Promise<Wedding> {
  await initializeCsrf();

  const csrfToken =
    getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error(
      "Nie udało się pobrać tokenu CSRF.",
    );
  }

  const response = await fetch(
    "/api/weddings/current/edit/",
    {
      method: "PATCH",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },

      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as Wedding;
}


export async function deleteWedding():
Promise<void> {
  await initializeCsrf();

  const csrfToken =
    getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error(
      "Nie udało się pobrać tokenu CSRF.",
    );
  }

  const response = await fetch(
    "/api/weddings/current/delete/",
    {
      method: "DELETE",

      credentials: "include",

      headers: {
        "X-CSRFToken": csrfToken,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }
}