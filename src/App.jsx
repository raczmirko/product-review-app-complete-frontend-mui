import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AlertSnackBar from './components/AlertSnackBar';
import ParticleBackground from './components/ParticleBackground';
import Sidebar from './components/Sidebar';
import Articles from './pages/Articles';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import Characteristics from './pages/Characteristics';
import Countries from './pages/Countries';
import Dashboard from './pages/Dashboard';
import Packagings from './pages/Packagings';
import Aspects from './pages/Aspects';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import Reviews from './pages/Reviews';

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
    const navigate = useNavigate();

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
        const sessionRememberMe = sessionStorage.getItem('rememberMe');
        if(sessionRememberMe === null || sessionRememberMe === 'false'){
            localStorage.removeItem('username');}
        localStorage.removeItem('sessionExpiryTime');
        setIsLoggedIn(false);
        showSnackBar('info', 'You have been logged out.');
        navigate('/login');
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
            <CssBaseline />
            <Sidebar isLoggedIn={isLoggedIn} expiryTime={expiryTime} logOut={logOut}/>
            <Routes>
                <Route path="/dashboard" element={
                    <div>
                        <Dashboard />
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
                <Route path="/countries" element={
                    <div>
                        <Countries />
                    </div>
                } />
                <Route path="/categories" element={
                    <div>
                        <Categories />
                    </div>
                } />
                <Route path="/characteristics" element={
                    <div>
                        <Characteristics />
                    </div>
                } />
                <Route path="/articles" element={
                    <div>
                        <Articles />
                    </div>
                } />
                <Route path="/packagings" element={
                    <div>
                        <Packagings />
                    </div>
                } />
                <Route path="/aspects" element={
                    <div>
                        <Aspects />
                    </div>
                } />
                <Route path="/products" element={
                    <div>
                        <Products />
                    </div>
                } />
                <Route path="/reviews" element={
                    <div>
                        <Reviews />
                    </div>
                } />
            </Routes>
        </ThemeProvider>
    )
}

export default App;