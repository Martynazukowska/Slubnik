import { Box, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
        }}
      >
        Dashboard
      </Typography>

      <Typography
        sx={{
          mt: 2,
        }}
      >
        Logowanie działa. Jesteś na dashboardzie.
      </Typography>
    </Box>
  );
}