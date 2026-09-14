import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { getCurrentUser, logout, type User } from "../api/auth";
import { ApiError } from "../api/client";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((current) => {
      if (active) setUser(current);
    }).catch((error: unknown) => {
      if (!active) return;
      if (error instanceof ApiError && error.status === 401) setUnauthorized(true);
      else setError("Nie udało się pobrać konta. Spróbuj ponownie.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  async function handleLogout() {
    setLoggingOut(true);
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Nie udało się wylogować. Spróbuj ponownie.");
    } finally { setLoggingOut(false); }
  }

  if (unauthorized) return <Navigate to="/login" replace />;
  return (
    <Box component="main" sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, sm: 4 } }}>
      {loading ? <CircularProgress aria-label="Ładowanie konta" /> : (
        <>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {!user && <Button onClick={() => { setLoading(true); setError(""); setAttempt((value) => value + 1); }}>Spróbuj ponownie</Button>}
          {user && <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 } }}>
            <Typography variant="h4" component="h1">Witaj, {user.first_name || user.username}!</Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>
              To Wasze miejsce na planowanie ślubu. Lista gości, budżet i zadania pojawią się tutaj w kolejnych etapach.
            </Typography>
            <Button variant="outlined" disabled={loggingOut} onClick={handleLogout}>
              {loggingOut ? "Wylogowywanie…" : "Wyloguj się"}
            </Button>
          </Paper>}
        </>
      )}
    </Box>
  );
}
