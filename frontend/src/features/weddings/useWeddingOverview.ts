import { useEffect, useState } from "react";
import { getCurrentUser, type User } from "../../api/auth";
import { ApiError } from "../../api/client";
import { getCurrentWedding, type Wedding } from "../../api/weddings";

type Overview =
  | { status: "loading" }
  | { status: "unauthorized" }
  | { status: "error"; message: string }
  | { status: "ready"; user: User; wedding: Wedding | null };

export function useWeddingOverview() {
  const [state, setState] = useState<Overview>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getCurrentUser(controller.signal), getCurrentWedding()])
      .then(([user, wedding]) => {
        if (!controller.signal.aborted) setState({ status: "ready", user, wedding });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof ApiError && error.status === 401) setState({ status: "unauthorized" });
        else setState({ status: "error", message: "Nie udało się pobrać danych. Spróbuj ponownie." });
      });
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }
  return { state, retry };
}
