import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import COLORS from "../../../util/colorUtil";

const BarChartUserReviewsPerCategory = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    DashboardService.getUserRatingsPerCategory()
      .then((data) => {
        initPieChart(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const initPieChart = (data) => {
    setPieChartData(
      data.map((elt, index) => ({
        label: `${elt.category.name} (${elt.reviewPercentage}%)`,
        value: elt.reviewAmount,
        percentage: elt.reviewPercentage,
        color: COLORS[index % COLORS.length],
      }))
    );
    setIsLoaded(true);
  };

  return (
    <Box sx={{ width: "100%", justifyContent: "center" }}>
      <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
        My reviews per category
      </Typography>
      <PieChart
        series={[
          {
            data: pieChartData,
            arcLabel: (item) => `${item.percentage}%`,
            arcLabelMinAngle: 50,
          },
        ]}
        height={300}
        loading={!isLoaded}
      />
    </Box>
  );
};

export default BarChartUserReviewsPerCategory;
