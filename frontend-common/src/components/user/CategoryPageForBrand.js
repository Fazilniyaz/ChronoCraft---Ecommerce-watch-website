import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import Product from "../product/Product";

const CategoryPageForBrand = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/products?keyword=${brandName}`
        );
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products", { position: "bottom-center" });
        setLoading(false);
      }
    };

    fetchBrands();
  }, [brandName]);

  return (
    <div className="container mt-4">
      <h1 className="text-center headings">{brandName} Products</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <Product key={product._id} product={product} />
            ))
          ) : (
            <div className="text-center">
              No products found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPageForBrand;
