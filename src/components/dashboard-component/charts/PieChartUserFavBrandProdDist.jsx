import { Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import DashboardService from '../../../services/DashboardService';
import COLORS from '../../../util/colorUtil';

const PieChartUserFavBrandProdDist = () => {
    const [pieChartData, setPieChartData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        DashboardService.getFavouriteBrandProductDistribution()
            .then(data => {
                initPieChart(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const initPieChart = (data) => {
        setPieChartData(
            data.map((elt, index) => ({
                label: elt.range,
                value: elt.percentage,
                color: COLORS[index % COLORS.length]
            }))
        );
        setIsLoaded(true);
    }

    return (
        <Box sx={{width: '100%', justifyContent: 'center', textAlign: 'center' }}>
            <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>
                My{' '}
                <Tooltip title="Brands with the most ratings." arrow>
                    <u>favourite</u>
                </Tooltip>
                {' '}brands' product-rating distribution
            </Typography>
            <Typography variant='subtitle2' color="text.secondary" sx={{ ml: 10, mr: 10, mb: 2, textAlign: 'center' }}>Example: '4-5' is 75% - This means that 75% of the products of your favourite brands have a rating average between 4 and 5. </Typography>
            <PieChart
                series={[
                    {
                        data: pieChartData,
                        arcLabel: (item) => `${item.value}%`,
                        arcLabelMinAngle: 45,
                    },
                ]}
                height={300}
                loading={!isLoaded}
            />
        </Box>
    );
}

export default PieChartUserFavBrandProdDist;