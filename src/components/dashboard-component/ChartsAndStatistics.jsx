import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import * as React from 'react';
import BarChartRecordCounts from './charts/BarChartRecordCounts';
import BarChartReviewsThisYear from './charts/BarChartReviewsThisYear';
import PieChartMostActiveUsers from './charts/PieChartMostActiveUsers';
import BarChartUserReviewsPerCategory from './charts/BarChartUserReviewsPerCategory';

const ChartsAndStatistics = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
          </div>
        );
    }
      
    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };
      
    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="charts and statistics">
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="My statistics" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid xs={12}>
                        <BarChartRecordCounts />
                    </Grid>
                    <Grid xs={6}>
                        <PieChartMostActiveUsers />
                    </Grid>
                    <Grid xs={6}>
                        <BarChartReviewsThisYear />
                    </Grid>
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
            <Grid container spacing={2}>
                    <Grid xs={8}>
                        <BarChartUserReviewsPerCategory />
                    </Grid>
                    <Grid xs={6}>
                    </Grid>
                    <Grid xs={6}>
                    </Grid>
                </Grid>
                
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                
            </CustomTabPanel>
        </Box>
    );
}

export default ChartsAndStatistics;