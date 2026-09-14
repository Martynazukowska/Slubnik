import { MenuItem, TextField } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export default function ThemeModeSelect() {
  const { mode, setMode } = useColorScheme();
  return (
    <TextField select label="Wygląd" size="small" value={mode ?? "system"}
      onChange={(event) => setMode(event.target.value as "light" | "dark" | "system")}
      sx={{ width: 150 }}>
      <MenuItem value="system">Systemowy</MenuItem>
      <MenuItem value="light">Jasny</MenuItem>
      <MenuItem value="dark">Ciemny</MenuItem>
    </TextField>
  );
}
