import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Sidebar from './components/Sidebar';
import ParticleBackground from './components/ParticleBackground';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <div>
            <Sidebar isLoggedIn={isLoggedIn}/>
            <ParticleBackground />
            <Typography variant='h1'>Hello World!</Typography>
        </div>
    )
}

export default App;