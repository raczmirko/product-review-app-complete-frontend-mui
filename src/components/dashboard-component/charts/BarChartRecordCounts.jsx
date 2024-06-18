import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import DashboardService from '../../../services/DashboardService';

const BarChartRecordCounts = () => {
    const [amounts, setAmounts] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        DashboardService.getRecordAmounts()
        .then(data => setAmounts(data))
        .catch(error => console.error('Error:', error))
        .finally(() => setIsLoaded(true));
    }, [])

    const valueFormatter = (value) => `${value} records`;

    return (
        <Box sx={{display: 'flex'}}>
            <Box sx={{width: '100%', justifyContent: 'center' }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: Object.keys(amounts) }]}
                    series={[{  data: Object.values(amounts), label: 'Amount of records', valueFormatter }]}
                    layout="vertical"
                    height={400}
                    loading={!isLoaded}
                />
            </Box>
        </Box>
    );
}

export default BarChartRecordCounts;