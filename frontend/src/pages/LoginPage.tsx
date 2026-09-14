import type { FormEvent } from "react";
import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  FavoriteBorder,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { login } from "../api/auth";


export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await login({
        username: username.trim(),
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Nie udało się zalogować.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#faf8f7",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: {
            xs: 3,
            sm: 5,
          },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <FavoriteBorder />
          </Box>
        </Box>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Witaj ponownie
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          Zaloguj się, aby kontynuować planowanie ślubu.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            label="Nazwa użytkownika"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            fullWidth
            required
            autoComplete="username"
            disabled={loading}
            sx={{
              mb: 2,
            }}
          />

          <TextField
            label="Hasło"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            fullWidth
            required
            autoComplete="current-password"
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "Ukryj hasło"
                          : "Pokaż hasło"
                      }
                      onClick={() =>
                        setShowPassword(
                          (current) => !current,
                        )
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 3,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={
              loading ||
              !username.trim() ||
              !password
            }
            sx={{
              py: 1.4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading
              ? "Logowanie..."
              : "Zaloguj się"}
          </Button>
        </Box>

        <Divider
          sx={{
            my: 3,
          }}
        >
          lub
        </Divider>

        <Typography
          color="text.secondary"
          sx={{
            textAlign: "center",
            mb: 1.5,
          }}
        >
          Nie masz jeszcze konta?
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => navigate("/register")}
          sx={{
            py: 1.3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Utwórz konto
        </Button>
      </Paper>
    </Box>
  );
}