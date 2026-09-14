import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useNavigate } from "react-router-dom";

import PageLayout from "../layouts/PageLayout";
import {
  deleteWedding,
  getCurrentWedding,
  updateWedding,
} from "../api/weddings";
import {
  minimumWeddingDate,
  normalizeBudget,
  validateWedding,
  type WeddingFields,
} from "../features/weddings/validation";

const emptyForm: WeddingFields = {
  wedding_date: "",
  city: "",
  guest_count: "",
  planned_budget: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function WeddingSettingsPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<WeddingFields>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadWedding() {
      try {
        const wedding = await getCurrentWedding();

        if (!wedding) {
          navigate("/dashboard");
          return;
        }

        setForm({
          wedding_date: wedding.wedding_date,
          city: wedding.city,
          guest_count: String(wedding.guest_count),
          planned_budget: wedding.planned_budget,
        });
      } catch (error) {
        setError(
          getErrorMessage(error, "Nie udało się pobrać danych wesela."),
        );
      } finally {
        setLoading(false);
      }
    }

    loadWedding();
  }, [navigate]);

  function change(field: keyof WeddingFields, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateWedding(form);
    const firstError = Object.values(validationErrors)[0];

    setError("");
    setSuccess("");

    if (firstError) {
      setError(firstError);
      return;
    }

    setSaving(true);

    try {
      await updateWedding({
        wedding_date: form.wedding_date,
        city: form.city.trim(),
        guest_count: Number(form.guest_count),
        planned_budget: normalizeBudget(form.planned_budget),
      });

      setSuccess("Dane wesela zostały zapisane.");
    } catch (error) {
      setError(
        getErrorMessage(error, "Nie udało się zapisać zmian."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      await deleteWedding();
      navigate("/dashboard");
    } catch (error) {
      setError(
        getErrorMessage(error, "Nie udało się usunąć wesela."),
      );
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <PageLayout compact>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout compact>
      <Stack spacing={4}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Edytuj swoje wesele
          </Typography>

          <Typography color="text.secondary">
            Tutaj możesz zmienić podstawowe informacje dotyczące wesela.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Paper
          variant="outlined"
          sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}
        >
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Data ślubu"
                type="date"
                value={form.wedding_date}
                onChange={(e) => change("wedding_date", e.target.value)}
                required
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: minimumWeddingDate() },
                }}
              />

              <TextField
                label="Miasto"
                value={form.city}
                onChange={(e) => change("city", e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Liczba gości"
                type="number"
                value={form.guest_count}
                onChange={(e) => change("guest_count", e.target.value)}
                required
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 1,
                  },
                }}
              />

              <TextField
                label="Planowany budżet"
                type="number"
                value={form.planned_budget}
                onChange={(e) => change("planned_budget", e.target.value)}
                required
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 100,
                  },
                }}
              />

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  disabled={saving}
                  sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                >
                  {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            borderColor: "error.main",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "error.main", fontWeight: 700 }}
          >
            Usuń wesele
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Usunięcie wesela spowoduje również usunięcie powiązanych danych.
            Tej operacji nie można cofnąć.
          </Typography>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Usuń wesele
          </Button>
        </Paper>
      </Stack>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Usunąć wesele?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć wesele i wszystkie powiązane dane?
            Tej operacji nie będzie można cofnąć.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Anuluj
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Usuwanie..." : "Usuń wesele"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}