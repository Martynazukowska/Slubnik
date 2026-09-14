import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import PageLayout from "../layouts/PageLayout";
import OverviewStatus from "../features/weddings/OverviewStatus";
import WeddingSummary from "../features/weddings/WeddingSummary";
import { useWeddingOverview } from "../features/weddings/useWeddingOverview";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { state, retry } = useWeddingOverview();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Nie udało się wylogować. Spróbuj ponownie.");
    } finally { setLoggingOut(false); }
  }

  if (state.status === "unauthorized") return <Navigate to="/login" replace />;
  return (
    <PageLayout>
      {state.status !== "ready" ? (
        <OverviewStatus message={state.status === "error" ? state.message : undefined} retry={retry} />
      ) : (
        <Stack spacing={3}>
          {logoutError && <Alert severity="error">{logoutError}</Alert>}
          {state.wedding ? <WeddingSummary wedding={state.wedding} /> : (
            <Paper variant="outlined" sx={{ p: { xs: 3, sm: 7 }, textAlign: "center" }}>
              <FavoriteBorderRoundedIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>Zacznijmy planowanie</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 480, mx: "auto", mb: 3 }}>
                Dodaj datę, miasto, liczbę gości i budżet. Tutaj znajdziesz podsumowanie Waszego wesela.
              </Typography>
              <Box>
                <Button component={RouterLink} to="/wedding/create" variant="contained" size="large" startIcon={<AddRoundedIcon />}>
                  Utwórz wesele
                </Button>
              </Box>
            </Paper>
          )}
        </Stack>
      )}
    </PageLayout>
  );
}
