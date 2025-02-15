import { useEffect, useState } from "react";
import DashboardService from "../../services/DashboardService";
import DataDisplayTable from "../tables/DataDisplayTable";

const WeakAspectsOfMostPopularProductsTable = () => {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState([]);

  useEffect(() => {
    DashboardService.getWeakAspectsOfMostPopularProducts()
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setIsLoaded(true));
  }, []);

  return isLoaded && <DataDisplayTable data={data} maxHeight={400} />;
};

export default WeakAspectsOfMostPopularProductsTable;
