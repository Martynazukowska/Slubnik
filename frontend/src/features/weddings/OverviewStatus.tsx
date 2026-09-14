import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";

export default function OverviewStatus({ message, retry }: { message?: string; retry: () => void }) {
  return message ? (
    <Stack 
      spacing={2} 
      sx={{ alignItems: "flex-start" }}
    >
      <Alert severity="error">{message}</Alert>
      <Button variant="outlined" onClick={retry}>Spróbuj ponownie</Button>
    </Stack>
  ) : (
    <Box role="status" sx={{ py: 8, textAlign: "center" }}>
      <CircularProgress aria-label="Ładowanie danych wesela" />
      <Typography color="text.secondary" sx={{ mt: 2 }}>Ładowanie danych…</Typography>
    </Box>
  );
}
