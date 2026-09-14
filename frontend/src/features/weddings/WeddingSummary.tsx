import { Box, Paper, Stack, Typography } from "@mui/material";
import type { Wedding } from "../../api/weddings";
import { formatCurrency, formatWeddingDate, weddingCountdown } from "./format";

function SummaryCard({ label, value, negative = false }: { label: string; value: string; negative?: boolean }) {
  return (
    <Paper component="div" variant="outlined" sx={{ p: 3, minWidth: 0 }}>
      <Typography component="dt" variant="body2" color="text.secondary" sx={{ mb: 1 }}>{label}</Typography>
      <Typography component="dd" variant="h6" sx={{ m: 0, overflowWrap: "anywhere", color: negative ? "error.main" : "text.primary" }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function WeddingSummary({ wedding }: { wedding: Wedding }) {
  return (
    <Stack spacing={4}>
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>{weddingCountdown(wedding.days_until_wedding)}</Typography>
        <Typography color="text.secondary">{formatWeddingDate(wedding.wedding_date)}</Typography>
      </Box>
      <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
        <SummaryCard label="Data ślubu" value={formatWeddingDate(wedding.wedding_date)} />
        <SummaryCard label="Miasto" value={wedding.city} />
        <SummaryCard label="Liczba gości" value={wedding.guest_count.toLocaleString("pl-PL")} />
      </Box>
      <Box component="section" aria-labelledby="budget-heading">
        <Typography id="budget-heading" variant="h5" component="h2" gutterBottom>Budżet wesela</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
          Kwota do zaplanowania to budżet pomniejszony o zaplanowane wydatki.
        </Typography>
        <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
          <SummaryCard label="Planowany budżet" value={formatCurrency(wedding.planned_budget)} />
          <SummaryCard label="Zaplanowane wydatki" value={formatCurrency(wedding.budget_summary.planned)} />
          <SummaryCard label="Zapłacono" value={formatCurrency(wedding.budget_summary.spent)} />
          <SummaryCard label={Number(wedding.budget_summary.remaining) < 0 ? "Przekroczenie budżetu" : "Do zaplanowania"}
            value={formatCurrency(wedding.budget_summary.remaining)} negative={Number(wedding.budget_summary.remaining) < 0} />
        </Box>
      </Box>
    </Stack>
  );
}
