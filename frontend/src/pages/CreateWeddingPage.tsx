import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { Alert, Box, Button, Divider, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { ApiError } from "../api/client";
import { createWedding } from "../api/weddings";
import PageLayout from "../layouts/PageLayout";
import OverviewStatus from "../features/weddings/OverviewStatus";
import { useWeddingOverview } from "../features/weddings/useWeddingOverview";
import { minimumWeddingDate, normalizeBudget, validateWedding, type WeddingErrors, type WeddingFields } from "../features/weddings/validation";

export default function CreateWeddingPage() {
  const navigate = useNavigate();
  const { state, retry } = useWeddingOverview();
  const [values, setValues] = useState<WeddingFields>({ wedding_date: "", city: "", guest_count: "", planned_budget: "" });
  const [errors, setErrors] = useState<WeddingErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [conflict, setConflict] = useState(false);
  const submitting = useRef(false);

  function change(field: keyof WeddingFields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setError("");
  }
  function blur(field: keyof WeddingFields) {
    setErrors((current) => ({ ...current, [field]: validateWedding(values)[field] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || conflict) return;
    const nextErrors = validateWedding(values);
    setErrors(nextErrors);
    setError("");
    const first = Object.keys(nextErrors)[0];
    if (first) {
      setError("Sprawdź zaznaczone pola.");
      (event.currentTarget.elements.namedItem(first) as HTMLInputElement | null)?.focus();
      return;
    }
    submitting.current = true;
    setLoading(true);
    try {
      await createWedding({
        wedding_date: values.wedding_date, city: values.city.trim(),
        guest_count: Number(values.guest_count), planned_budget: normalizeBudget(values.planned_budget),
      });
      navigate("/dashboard", { replace: true });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) setExpired(true);
      else if (cause instanceof ApiError && cause.status === 409) setConflict(true);
      else {
        setError(cause instanceof ApiError ? cause.message : "Nie udało się zapisać wesela. Sprawdź połączenie i spróbuj ponownie.");
        if (cause instanceof ApiError) {
          const fields: WeddingErrors = {};
          for (const field of Object.keys(values) as (keyof WeddingFields)[]) {
            if (cause.fieldErrors[field]?.length) fields[field] = cause.fieldErrors[field].join(" ");
          }
          setErrors(fields);
        }
      }
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  if (expired || state.status === "unauthorized") return <Navigate to="/login" replace />;
  if (state.status === "ready" && state.wedding) return <Navigate to="/dashboard" replace />;
  if (state.status !== "ready") return (
    <PageLayout compact><OverviewStatus message={state.status === "error" ? state.message : undefined} retry={retry} /></PageLayout>
  );

  const fieldProps = (field: keyof WeddingFields) => ({
    id: field, name: field, value: values[field], required: true,
    disabled: loading || conflict, error: Boolean(errors[field]),
    onChange: (event: ChangeEvent<HTMLInputElement>) => change(field, event.target.value),
    onBlur: () => blur(field),
  });

  return (
    <PageLayout compact>
      <Stack spacing={3}>
        <Box sx={{ textAlign: "center" }}>
          <FavoriteBorderRoundedIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>Wasze wesele</Typography>
          <Typography color="text.secondary">Zacznijmy od daty, miejsca i pierwszych planów.</Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" noValidate aria-label="Dodaj wesele" aria-busy={loading} onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              {conflict && <Alert severity="info">
                Wesele jest już utworzone. <RouterLink to="/dashboard">Przejdź do dashboardu</RouterLink>
              </Alert>}
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>Kiedy i gdzie?</Typography>
                <Typography variant="body2" color="text.secondary">Wybierz przyszłą datę ślubu i miasto, w którym planujecie wesele.</Typography>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                <TextField {...fieldProps("wedding_date")} label="Data ślubu" type="date"
                  helperText={errors.wedding_date || "Data późniejsza niż dzisiaj."}
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: minimumWeddingDate(), max: "9999-12-31" } }} />
                <TextField {...fieldProps("city")} label="Miasto" placeholder="np. Wrocław" autoComplete="address-level2"
                  helperText={errors.city || "Miejsce Waszego wesela."} slotProps={{ htmlInput: { maxLength: 150 } }} />
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>Goście i budżet</Typography>
                <Typography variant="body2" color="text.secondary">Podajcie planowaną liczbę gości i całkowity budżet wesela.</Typography>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                <TextField {...fieldProps("guest_count")} label="Liczba gości" type="number"
                  helperText={errors.guest_count || "Liczba całkowita, minimum 1 osoba."}
                  slotProps={{ htmlInput: { min: 1, max: 400, step: 1, inputMode: "numeric" } }} />
                <TextField {...fieldProps("planned_budget")} label="Planowany budżet" type="number" placeholder="np. 50000,00"
                  helperText={errors.planned_budget || "Możesz podać grosze, np. 50000,50."}
                  slotProps={{ htmlInput: { inputMode: "decimal", maxLength: 13 },
                    input: { endAdornment: <InputAdornment position="end">zł</InputAdornment> } }} />
              </Box>
              <Divider />
              <Stack direction={{ xs: "column", sm: "row-reverse" }} spacing={2}>
                <Button type="submit" variant="contained" size="large" disabled={loading || conflict}>
                  {loading ? "Zapisywanie wesela…" : "Utwórz wesele"}
                </Button>
                <Button component={RouterLink} to="/dashboard" disabled={loading}>Wróć do dashboardu</Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </PageLayout>
  );
}
