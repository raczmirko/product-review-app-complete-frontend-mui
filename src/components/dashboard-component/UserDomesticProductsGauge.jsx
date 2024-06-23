import { Box, Typography, Stack } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import * as React from 'react';
import { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';

const UserDomesticProductsGauge = () => {
    const [data, setData] = useState(0);
    const [isLoaded, setIsLoaded] = useState([]);

    useEffect(() => {
        DashboardService.getUserDomesticProductPercentage()
        .then(data => {setData(data)})
        .catch(error => console.error('Error:', error))
        .finally(() => setIsLoaded(true));
    }, [])

    return (
        isLoaded && (
            <Box sx={{width: '100%', justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>Domestic product review percentage</Typography>
                <Typography variant='subtitle2' color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>*Products whose company has the same nationality as me</Typography>
                <Gauge 
                    height={200} 
                    value={data}
                    text={
                        ({ value }) => `${value}%`
                    }
                    sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 30,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                        fill: '#52b202',
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                        fill: theme.palette.text.disabled,
                        },
                    })}
                    />
            </Box>      
        )
    );
}

export default UserDomesticProductsGauge;