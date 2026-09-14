import type { FormEvent } from "react"
import { useState } from "react"

import {
  Alert,
  Box,
  Button,
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

import { register } from "../api/auth";


export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);

    if (password !== passwordRepeat) {
      setError("Hasła nie są takie same.");
      return;
    }

    setLoading(true);

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        password_repeat: passwordRepeat,
      });

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Nie udało się utworzyć konta.",
        );
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
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#faf8f7",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
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
          <FavoriteBorder />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            mb: 1,
          }}
        >
          Utwórz konto
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          Zacznij planować swoje wesele.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Nazwa użytkownika"
            fullWidth
            required
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="E-mail"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="Hasło"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          (value) => !value,
                        )
                      }
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
            sx={{ mb: 2 }}
          />

          <TextField
            label="Powtórz hasło"
            type="password"
            fullWidth
            required
            value={passwordRepeat}
            onChange={(event) =>
              setPasswordRepeat(
                event.target.value,
              )
            }
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={
              loading ||
              !username.trim() ||
              !email.trim() ||
              !password ||
              !passwordRepeat
            }
            sx={{
              py: 1.4,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {loading
              ? "Tworzenie konta..."
              : "Utwórz konto"}
          </Button>

          <Button
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              mt: 2,
              textTransform: "none",
            }}
          >
            Mam już konto
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}