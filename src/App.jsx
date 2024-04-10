import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Sidebar from './components/Sidebar';
import { ThemeContext, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Brands from './pages/Brands';
import AlertSnackBar from './components/AlertSnackBar';
import ParticleBackground from './components/ParticleBackground';
import Container from '@mui/material/Container';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [expiryTime, setExpiryTime] = useState(null);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState('');
    const [snackBarStatus, setSnackBarStatus] = useState('info');

    useEffect(() => {
        const storedExpiryTime = localStorage.getItem('sessionExpiryTime');
        const currentTime = new Date().getTime();

        if (storedExpiryTime && storedExpiryTime > currentTime) {
            setIsLoggedIn(true);
            setExpiryTime(storedExpiryTime);
        }
    }, []);

    const handleLogin = async () => {
        await fetchSessionLengthAndUsername();
        setIsLoggedIn(true);
        showSnackBar('success', 'You have logged in successfully.');
    }

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    const fetchSessionLengthAndUsername = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        setUsername(localStorage.getItem('username'));
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch('http://localhost:8080/security/session-second', { headers });
            if (!response.ok) {
                throw new Error('Failed to fetch session expiry time.');
            }
            const data = await response.json();
            setExpiryTime(new Date().getTime() + data * 1000);
            localStorage.setItem('sessionExpiryTime', new Date().getTime() + data * 1000);
            return;
        } catch (error) {
            console.error('Error fetching session length:', error);
            return []; // Return an empty array if an error occurs
        }
    }

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('sessionExpiryTime');
        setIsLoggedIn(false);
        showSnackBar('success', 'You have been logged out.');
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
            <CssBaseline />
            <Router>
                <Sidebar isLoggedIn={isLoggedIn} expiryTime={expiryTime} logOut={logOut}/>
                <Routes>
                    <Route path="/" element={
                        <div>
                            <Home />
                        </div>
                    } />
                    <Route path="/login" element={
                        <div>
                            <SignInSide onLogin={handleLogin} isLoggedIn={isLoggedIn} />
                        </div>
                    } />
                    <Route path="/register" element={
                        <div>
                            <Container sx={{position: 'absolute', zIndex:-1}}>
                                <ParticleBackground/>
                            </Container>
                            <SignUp />
                        </div>
                    } />
                    <Route path="/brands" element={
                        <div>
                            <Brands />
                        </div>
                    } />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App;