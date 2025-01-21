import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import Product from "../product/Product";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/products?category=${categoryName}`
        );
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products", { position: "bottom-center" });
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="container mt-4">
      <h1 className="text-center headings">{categoryName} Products</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              //   <div key={product._id} className="col-6 col-md-4 my-3 cards">
              //     <div className="card">
              //       <img
              //         src={product.images[0].image}
              //         alt={product.name}
              //         className="card-img-top"
              //       />
              //       <div className="card-body">
              //         <h5 className="card-title">{product.name}</h5>
              //         <p className="card-text">${product.price}</p>
              //         <button className="btn btn-primary">View Details</button>
              //       </div>
              //     </div>
              //   </div>
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

export default CategoryPage;
