import { MenuItem, TextField } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export default function ThemeModeSelect() {
  const { mode, systemMode, setMode } = useColorScheme();
  const resolvedMode = mode === "system" ? systemMode : mode;
  return (
    <TextField id="theme-mode" select label="Wygląd" size="small" value={resolvedMode ?? "light"}
      onChange={(event) => setMode(event.target.value as "light" | "dark")}
      sx={{ width: { xs: 115, sm: 150 }, flexShrink: 0 }}>
      <MenuItem value="light">Jasny</MenuItem>
      <MenuItem value="dark">Ciemny</MenuItem>
    </TextField>
  );
}
