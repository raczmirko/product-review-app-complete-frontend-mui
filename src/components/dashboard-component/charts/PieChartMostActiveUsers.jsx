import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import DashboardService from '../../../services/DashboardService';
import COLORS from '../../../util/colorUtil';

const BarChartRecordCounts = () => {
    const [pieChartData, setPieChartData] = useState([]);
    const [userCount, setUserCount] = useState(3);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        DashboardService.getMostActiveUsers(userCount)
            .then(data => {
                initPieChart(data);
            })
            .catch(error => console.error('Error:', error));
    }, [userCount]);

    const initPieChart = (users) => {
        setPieChartData(
            users.map((user, index) => ({
                label: user.user.username,
                value: user.reviewCount,
                color: COLORS[index % COLORS.length]
            }))
        );
        setIsLoaded(true);
    }

    const changeUserCount = (amount) => {
       if(amount > 0) setUserCount(amount);
    }

    return (
        <Box sx={{width: '100%', justifyContent: 'center' }}>
            <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>Most active users by review amount</Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <TextField
                    label="User count (TOP n users)"
                    value={userCount}
                    onChange={(e) => changeUserCount(e.target.value)}
                    type="number"
                    required
                    InputLabelProps={{
                        maxLength: 100,
                        shrink: true,
                    }}
                />
            </Box>
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