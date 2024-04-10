import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertSnackBar from '../components/AlertSnackBar';
import CountrySelector from '../components/CountrySelector';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Product Review Application
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState('');
    const [snackBarStatus, setSnackBarStatus] = useState('info');

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    const getNotificationTextByStatusCode = (code) => {
        let text = code + ": An error occurred, please try again later!";
        if(code === 400) {
            text = code + ": This username is probably already in use.";
        }
        return text;
    }

    const checkPasswordValidity = (e) => {
        e.preventDefault();
        if(password !== passwordAgain) {
            const errorText = "The two passwords do not match!";
            console.error(errorText);
            showSnackBar('error', errorText);
            return;
        }
        if(!/[A-Z]/.test(password)) {
            const errorText = "The password must contain at least one capital letter!";
            console.error(errorText);
            showSnackBar('error', errorText);
            return;
        }
        if(!/[0-9]/.test(password)) {
            const errorText = "The password must contain at least one number!";
            console.error(errorText);
            showSnackBar('error', errorText);
            return;
        }
         if (!/[^A-Za-z0-9]/.test(password)) {
            const errorText = "The password must contain at least one special character!";
            console.error(errorText);
            showSnackBar('error', errorText);
            return;
        }
        else {
            handleRegistration(e);
        }
    }

    const handleRegistration = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const credentials = {
            username: username,
            password: password,
            country: selectedCountry
        };

        fetch('http://localhost:8080/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => {
            if (!response.ok) {
                showSnackBar('error', getNotificationTextByStatusCode(response.status));
                throw new Error('Registration failed');
            }
            else {
                showSnackBar('success', 'Registration successful!');
                //Clear form fields upon registration
                setSelectedCountry('');
            }
        })
        .catch(error => console.error('Error:', error));
    };

  return (
    <ThemeProvider theme={defaultTheme}>
        <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
            }}>
            <Container component="main" maxWidth="xs" sx={{bgcolor:'white', borderRadius: '15px', padding: 10, justifyContent: 'center', border: '1px solid white'}}>
                <CssBaseline />
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component='form' onSubmit={checkPasswordValidity} sx={{ mt: 3 }}>
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
                                <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                required
                                fullWidth
                                name="passwordAgain"
                                label="Password Again"
                                type="password"
                                id="passwordAgain"
                                onChange={(e) => setPasswordAgain(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CountrySelector selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} isRequired='true'/>
                            </Grid>
                            
                        </Grid>
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
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
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Container>
        </Box>
    </ThemeProvider>
  );
}