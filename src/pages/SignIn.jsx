import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import CopyrightTypography from '../components/CopyrightTypography';
import { useNotification } from '../services/NotificationProvider';
import { getLoginErrorByStatus } from '../util/stringUtil';

const defaultTheme = createTheme();

const SignInSide = ({ onLogin, isLoggedIn }) => {

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState();
  const [isUsernameLoaded, setIsUsernameLoaded] = useState(false);
  const showNotification = useNotification();

  useEffect(() => {
    if(!isLoggedIn){checkIfUsernameIsRemembered();}
  }, [isLoggedIn]);

  useEffect(() => {
    sessionStorage.setItem('rememberMe', rememberMe);
  }, [rememberMe]);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  function toggleRememberMe () {
    setRememberMe(!rememberMe);
  }

  function checkIfUsernameIsRemembered () {
    const storedUsername = localStorage.getItem('username');
    if(storedUsername) {
      setUsername(storedUsername);
      setRememberMe(true);
    }
    else {
      setRememberMe(false);
    }
    setIsUsernameLoaded(true);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = {
        username: username,
        password: password
    };    

    fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => {
        const authorizationHeader = response.headers.get("Authorization");
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
        }

        if (!response.ok) {
            showNotification('error', getLoginErrorByStatus(response.status));
            throw new Error('Login failed');
        }
        onLogin();
        showNotification('success', 'SUCCESS: You have been logged in.');
        return;
    })
    .catch(error => {
        if (error instanceof TypeError) {
            const error = 'Network error. The server might be down.';
            console.error(error);
            showNotification('error', error);
        } else {
            console.error('Error during login:', error);
        }
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 20,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {isUsernameLoaded && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus={username === ""}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoFocus={username !== ""}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={rememberMe} color="primary" />}
                    label="Remember username"
                    onChange={(e) => toggleRememberMe()}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <CopyrightTypography/>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;