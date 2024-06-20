import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import DashboardService from '../../../services/DashboardService';
import COLORS from '../../../util/colorUtil';

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
        <Box>
            <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>Number of records in each table</Typography>
            <Box sx={{ width: '100%' }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: Object.keys(amounts) }]}
                    series={[{  data: Object.values(amounts), label: 'Amount of records', valueFormatter, color: COLORS[2] }]}
                    layout="vertical"
                    height={400}
                    loading={!isLoaded}
                />
            </Box>
        </Box>
    );
}

export default BarChartRecordCounts;