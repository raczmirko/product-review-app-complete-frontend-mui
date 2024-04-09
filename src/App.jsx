import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Sidebar from './components/Sidebar';
import ParticleBackground from './components/ParticleBackground';
import { ThemeContext, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div>
                <Sidebar isLoggedIn={isLoggedIn}/>
                <ParticleBackground />
                <Typography variant='h1'>Hello World!</Typography>
            </div>
        </ThemeProvider>
    )
}

export default App;