import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CopyrightTypography from "../components/CopyrightTypography";
import CountrySelector from "../components/selectors/CountrySelector";
import { useNotification } from "../services/NotificationProvider";

const defaultTheme = createTheme();

export default function SignUp() {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();
  const showNotification = useNotification();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const getNotificationTextByStatusCode = (code) => {
    let text = code + ": An error occurred, please try again later!";
    if (code === 400) {
      text = code + ": This username is probably already in use.";
    }
    return text;
  };

  const checkPasswordValidity = (e) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      const errorText = "ERROR: The two passwords do not match!";
      console.error(errorText);
      showNotification("error", errorText);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      const errorText =
        "ERROR: The password must contain at least one capital letter!";
      console.error(errorText);
      showNotification("error", errorText);
      return;
    }
    if (!/[0-9]/.test(password)) {
      const errorText = "ERROR: The password must contain at least one number!";
      console.error(errorText);
      showNotification("error", errorText);
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      const errorText =
        "ERROR: The password must contain at least one special character!";
      console.error(errorText);
      showNotification("error", errorText);
      return;
    } else {
      handleRegistration(e);
    }
  };

  const handleRegistration = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const credentials = {
      username: username,
      password: password,
      country: selectedCountry,
    };

    fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) {
          showNotification(
            "error",
            getNotificationTextByStatusCode(response.status)
          );
          throw new Error("Registration failed");
        } else {
          redirectToLoginPage();
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const redirectToLoginPage = () => {
    let time = 3;
    showNotification(
      "success",
      `Registration successful, redirecting to login page in ${time}...`
    );
    const intervalId = setInterval(() => {
      if (time === 0) {
        clearInterval(intervalId);
        navigate("/login");
      } else {
        time--;
        showNotification(
          "success",
          `Registration successful, redirecting to login page in ${time}...`
        );
      }
    }, 1000);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          overflow: "auto", // Allows scrolling if content overflows
          padding: 2,
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            bgcolor: "white",
            borderRadius: "15px",
            padding: 4,
            justifyContent: "center",
            border: "1px solid white",
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={checkPasswordValidity}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    fullWidth
                    required
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.23)",
                      borderRadius: "5px",
                      padding: "10px",
                      width: "100%",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    fullWidth
                    required
                    id="passwordAgain"
                    name="passwordAgain"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    onChange={(e) => setPasswordAgain(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.23)",
                      borderRadius: "5px",
                      padding: "10px",
                      width: "100%",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    isRequired="true"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Accordion sx={{ boxShadow: "none", bgcolor: "transparent" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="password-hint-content"
                      id="password-hint-header"
                      sx={{ fontSize: 12, color: "gray" }}
                    >
                      Need help with password requirements?
                    </AccordionSummary>
                    <AccordionDetails sx={{ fontSize: 12, color: "gray" }}>
                      Password must contain at least one special character, one
                      uppercase letter, and one number.
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <CopyrightTypography />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
