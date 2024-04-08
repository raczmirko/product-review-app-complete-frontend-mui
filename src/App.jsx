import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Sidebar from './components/Sidebar';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <div>
            <Sidebar isLoggedIn={isLoggedIn}/>
            <Typography variant='h1'>Hello World!</Typography>
        </div>
    )
}

export default App;