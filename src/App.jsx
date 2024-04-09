import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Sidebar from './components/Sidebar';
import ParticleBackground from './components/ParticleBackground';
import { ThemeContext, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSide from './pages/SignIn';
import Register from './pages/Register';
import Home from './pages/Home';
import Alert from '@mui/material/Alert';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [expiryTime, setExpiryTime] = useState(null);

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
    };

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
    };

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        <Alert severity="information">You have been logged out.</Alert>
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Sidebar isLoggedIn={isLoggedIn}/>
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
                            <ParticleBackground />
                            <Register />
                        </div>
                    } />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App;