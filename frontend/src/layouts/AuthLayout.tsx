import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

export default function AuthLayout({ title, description, children }: {
  title: string; description: string; children: ReactNode;
}) {
  return (
    <Box component="main" sx={{ display: "grid", placeItems: "center", px: 2, py: 5 }}>
      <Paper variant="outlined" sx={{ width: "100%", maxWidth: 450, p: { xs: 3, sm: 5 } }}>
        <Box sx={{ textAlign: "center", color: "primary.main", mb: 2 }}>
          <FavoriteBorder fontSize="large" />
        </Box>
        <Typography variant="h4" component="h1" align="center" gutterBottom>{title}</Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>{description}</Typography>
        {children}
      </Paper>
    </Box>
  );
}
