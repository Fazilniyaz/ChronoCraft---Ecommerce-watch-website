import React, { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import Loader from "./layouts/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/userActions";

export const Home = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState
  );

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };
  const handleBrandsClick = (brandName) => {
    navigate(`/category/brand/${brandName}`);
  };

  const { user = "" } = useSelector((state) => state.authState);

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/user/category");
        setCategories(data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories", {
          position: "bottom-center",
        });
      }
    };

    fetchCategories();

    if (user && user.blocked === true) {
      toast("You are Blocked by the Admin");
      dispatch(logout);
    }

    if (error) {
      return toast.error(error, {
        position: "bottom-center",
      });
    }

    dispatch(getProducts(null, null, null, null, null, currentPage));
  }, [error, dispatch, currentPage, user]);

  const DemoCategories = [
    "smart",
    "automatic",
    "edge",
    "mechanical",
    "trending",
  ];
  const DemoBrands = ["Titan", "Fastrack", "Sonata", "Zoop", "SF"];

  return (
    <Fragment>
      <style>
        {`
          #categories .category-circle {
            width: 100px;
            height: 100px;
            overflow: hidden;
            margin: auto;
            border: 2px solid #ccc;
            border-radius: 50%;
          }

          #categories .category-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          #poster img {
            border-radius: 10px;
          }

          .headings {
            font-size: 1.8rem;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
          }
        `}
      </style>

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />

          {/* Categories Section */}
          <h1 className="headings">Shop By Categories</h1>
          <section id="categories" className="container mt-4">
            <div className="row d-flex justify-content-center">
              {categories.slice(0, 5).map((category, i) => (
                <div
                  key={category._id}
                  className="col-6 col-md-2 text-center my-2"
                  onClick={() => handleCategoryClick(category.name)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="category-circle">
                    <img
                      src={`/images/categories/${DemoCategories[i]}.avif`} // Replace with actual image paths
                      alt={category.name}
                      className="img-fluid rounded-circle"
                    />
                  </div>
                  <p>{category.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Brands Section */}
          <h1 className="headings">Shop By Brands</h1>
          <section id="categories" className="container mt-4">
            <div className="row d-flex justify-content-center">
              {DemoBrands.map((category, i) => (
                <div
                  key={category._id}
                  className="col-6 col-md-2 text-center my-2"
                  onClick={() => handleBrandsClick(DemoBrands[i])}
                  style={{ cursor: "pointer" }}
                >
                  <div className="category-circle">
                    <img
                      src={`/images/brands/${DemoBrands[i].toLowerCase()}.png`} // Replace with actual image paths
                      alt={category.name}
                      className="img-fluid rounded-circle"
                    />
                  </div>
                  <p>{DemoBrands[i]}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Poster Section */}
          <section id="poster" className="container mt-4">
            <div className="row">
              <div className="col-12">
                <img
                  src={`/images/posters/poster1.webp`} // Replace with actual poster path
                  alt="Promotional Poster"
                  className="img-fluid w-100"
                />
              </div>
            </div>
          </section>

          {/* Latest Arrivals Section */}
          <h1 className="headings">Latest Arrivals</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) =>
                  product.disabled === false ? (
                    <Product key={product._id} product={product} />
                  ) : (
                    ""
                  )
                )}
            </div>
          </section>

          {productsCount > 0 && productsCount > resPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={"Next"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass={"page-item"}
                linkClass={"page-link"}
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
