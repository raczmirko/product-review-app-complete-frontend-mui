import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import DashboardService from '../../../services/DashboardService';
import COLORS from '../../../util/colorUtil';

const BarChartRecordCounts = () => {
    const [mostActiveUsers, setMostActiveUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        DashboardService.getMostActiveUsers()
        .then(data => setMostActiveUsers(data))
        .catch(error => console.error('Error:', error))
        .finally(() => setIsLoaded(true));
    }, [])

    const pieChartData = mostActiveUsers.map((user, index) => ({
        label: user.user.username,
        value: user.reviewCount,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <Box sx={{width: '100%' }}>
            <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>Most active users by review amount</Typography>
            <PieChart
                series={[
                    {
                        data: pieChartData,
                        arcLabel: (item) => `${item.value}`,
                        arcLabelMinAngle: 45,
                    },
                ]}
                width={400}
                height={200}
                loading={!isLoaded}
                />
        </Box>
    );
}

export default BarChartRecordCounts;