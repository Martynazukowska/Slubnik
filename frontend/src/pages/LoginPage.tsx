import AuthLayout from "../layouts/AuthLayout";
import type { FormEvent } from "react";
import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
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
    if (loading) return;

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
    <AuthLayout title="Witaj ponownie" description="Zaloguj się, aby kontynuować planowanie ślubu.">
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
    </AuthLayout>
  );
}