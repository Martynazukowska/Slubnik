import { useState, type ReactNode } from "react";
import {
  Box,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import Sidebar, {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
} from "./AppSidebar";

interface PageLayoutProps {
  children: ReactNode;
  compact?: boolean;
}

export default function PageLayout({
  children,
  compact = false,
}: PageLayoutProps) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = sidebarExpanded
    ? SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar
        mobile={mobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((current) => !current)}
      />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: mobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        {mobile && (
          <Box sx={{ px: 2, pt: 2 }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Otwórz menu"
            >
              <MenuRoundedIcon />
            </IconButton>
          </Box>
        )}

        <Container
          component="main"
          maxWidth={compact ? "md" : "lg"}
          sx={{ py: { xs: 3, sm: 5 } }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}