import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: { palette: {
      primary: { main: "#875064" },
      secondary: { main: "#526b59" },
      background: { default: "#faf7f5", paper: "#ffffff" },
      text: { primary: "#30272b", secondary: "#6e6267" },
      divider: "#e5dce0",
    } },
    dark: { palette: {
      primary: { main: "#e7a9bf" },
      secondary: { main: "#adc8b3" },
      background: { default: "#191619", paper: "#252025" },
      text: { primary: "#f6edf1", secondary: "#c9bbc2" },
      divider: "#463a41",
    } },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    h4: { fontWeight: 700, fontSize: "2rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: {
      root: { borderRadius: 12 }, sizeLarge: { paddingBlock: 12 },
    } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiTextField: { defaultProps: { fullWidth: true, variant: "outlined" } },
  },
});
