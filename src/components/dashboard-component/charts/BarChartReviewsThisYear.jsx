import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import DashboardService from '../../../services/DashboardService';
import COLORS from '../../../util/colorUtil';

const BarChartReviewsThisYear = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        DashboardService.getThisYearsReviews()
        .then(data => setChartData(data))
        .catch(error => console.error('Error:', error))
        .finally(() => setIsLoaded(true));
    }, [])

    const valueFormatter = (value) => `${value} records`;

    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>This year's reviews by month</Typography>
            <Box sx={{ width: '100%' }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: chartData.map(elt => elt.month) }]}
                    series={[{  data: chartData.map(elt => elt.reviewCount), label: 'Amount of reviews', valueFormatter }]}
                    layout="vertical"
                    height={400}
                    loading={!isLoaded}
                    colors={COLORS}
                />
            </Box>
        </Box>
    );
}

export default BarChartReviewsThisYear;