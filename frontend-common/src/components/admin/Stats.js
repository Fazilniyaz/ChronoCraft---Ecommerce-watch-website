import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./SideBar";
import { Fragment } from "react";

const Stats = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [boolean, setBoolean] = useState(false);

  console.log(topProducts);
  console.log(topCategories);
  console.log(topBrands);

  useEffect(() => {
    // Fetch data from the backend
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`/api/v1/admin/getTopSellingStats`); // Replace with your actual endpoint
        console.log(data.data);
        setTopProducts(data.data.topProducts);
        setTopCategories(data.data.topCategories);
        setTopBrands(data.data.topBrands);
        setBoolean(true);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [boolean]);

  return (
    <Fragment>
      <div className="stats-page">
        <h1 className="headings mb-3">Stats</h1>

        <div className="stats-section">
          <h2>Top 5 Products</h2>
          <ul>
            {topProducts &&
              topProducts.map((product) => (
                <li key={product._id}>
                  {product.product.name} - Sold: {product.quantitySold}
                </li>
              ))}
          </ul>
        </div>

        <div className="stats-section">
          <h2>Top 5 Categories</h2>
          <ul>
            {topCategories &&
              topCategories.map((category, i) => (
                <li key={i}>
                  {category.key} - Sold: {category.value}
                </li>
              ))}
          </ul>
        </div>

        <div className="stats-section">
          <h2>Top 3 Brands</h2>
          <ul>
            {topBrands &&
              topBrands.map((brand, i) => (
                <li key={i}>
                  {brand.key} - Sold: {brand.value}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Stats;
