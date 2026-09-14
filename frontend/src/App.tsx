import { Box, Typography } from "@mui/material";
import ThemeModeSelect from "./theme/ThemeModeSelect";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateWeddingPage from "./pages/CreateWeddingPage";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import WeddingSettingsPage from "./pages/WeddingSettingsPage";


function App() {
  return (
    <BrowserRouter>
      <Box
        component="header"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr) auto", sm: "1fr auto 1fr" },
          gap: 2,
          alignItems: "center",
          minHeight: 76,
          px: {
            xs: 2,
            sm: 3,
          },
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "block" } }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.2,
          }}
        >
          <FavoriteBorderRoundedIcon
            sx={{
              fontSize: 17,
              color: "primary.main",
              opacity: 0.55,
              transform: "rotate(-8deg)",
            }}
          />

          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: 500,
                letterSpacing: "0.05em",
                color: "primary.main",
                lineHeight: 1,
              }}
            >
              Ślubnik
            </Typography>

            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                mt: 0.6,
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "text.secondary",
                opacity: 0.75,
              }}
            >
              Wasz dzień, Wasza historia
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <ThemeModeSelect />
        </Box>
      </Box>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/wedding/create"
          element={<CreateWeddingPage />}
        />

        <Route
          path="/wedding/settings"
          element={<WeddingSettingsPage />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;