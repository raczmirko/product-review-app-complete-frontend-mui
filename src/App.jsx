import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import Sidebar from './components/Sidebar';
import Articles from './pages/Articles';
import Aspects from './pages/Aspects';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import Characteristics from './pages/Characteristics';
import Countries from './pages/Countries';
import Dashboard from './pages/Dashboard';
import Packagings from './pages/Packagings';
import Products from './pages/Products';
import Reviews from './pages/Reviews';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';
import { NotificationProvider } from './services/NotificationProvider';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

const App = () => {
    
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [expiryTime, setExpiryTime] = useState(null);
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
    }

    const fetchSessionLengthAndUsername = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch(`${API_BASE_URL}/security/session-second`, { headers });
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
        navigate('/login');
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <NotificationProvider>
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
            </NotificationProvider>
        </ThemeProvider>
    )
}

export default App;