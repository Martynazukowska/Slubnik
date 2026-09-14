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
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";


function App() {
  return (
    <BrowserRouter>
      <Box
        component="header"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
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
        <Box />

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
                fontFamily: '"Georgia", "Times New Roman", serif',
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