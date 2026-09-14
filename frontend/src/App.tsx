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


function App() {
  return (
    <BrowserRouter>
      <Box component="header" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography color="primary" sx={{ fontWeight: 700 }}>Ślubnik</Typography>
        <ThemeModeSelect />
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