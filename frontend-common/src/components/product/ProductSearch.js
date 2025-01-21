import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import { useDispatch } from "react-redux";
import { getProducts } from "../../actions/productActions";
import { useSelector } from "react-redux";
import Product from "../product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";

export const ProductSearch = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { keyword } = useParams();
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(0);
  const [genders, setGenders] = useState(null);
  const [priceChanged, setPriceChanged] = useState(price);

  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState
  );

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const categories = ["Automatic", "Edge", "Mechanical", "Smart", "Trending"];
  const gender = ["Men", "Women", "Unisex", "Couple", "Boys", "Girls", "Gents"];

  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "bottom-center",
      });
    }

    dispatch(
      getProducts(keyword, priceChanged, category, rating, genders, currentPage)
    );
  }, [
    error,
    dispatch,
    currentPage,
    keyword,
    category,
    rating,
    genders,
    priceChanged,
  ]);

  // Helper function to toggle the filter selection
  const toggleFilter = (filterType, value) => {
    if (filterType === "category") {
      setCategory(category === value ? null : value);
    } else if (filterType === "gender") {
      setGenders(genders === value ? null : value);
    } else if (filterType === "rating") {
      setRating(rating === value ? 0 : value);
    }
  };

  return (
    <Fragment>
      <style>
        {`
        /* Internal CSS for filter underline animations */
        .filter-item {
          list-style-type: none;
          cursor: pointer;
          position: relative;
          display: inline-block;
          padding: 5px 10px;
          margin: 5px 0;
          transition: color 0.3s ease;
        }

        .filter-item.selected {
          color: #007bff; /* Highlight color for the selected filter */
        }

        .filter-item::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: #007bff;
          transition: width 0.3s ease-in-out;
        }

        .filter-item.selected::after {
          width: 100%;
        }
        `}
      </style>

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <h1 id="products_heading" className="mt-3 headings">
            Search Products
          </h1>

          <section id="products" className="container mt-5">
            <h1 className="heading">Price</h1>
            <div className="row">
              <div className="col-6 col-md-3 mb-5 mt-5">
                <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                  <Slider
                    range={true}
                    marks={{ 1: "$1", 1000: "$1000" }}
                    min={1}
                    max={1000}
                    defaultValue={price}
                    onChange={(price) => setPrice(price)}
                    handleRender={(renderProps) => {
                      return (
                        <Tooltip
                          overlay={`$${renderProps.props["aria-valuenow"]}`}
                        >
                          <div {...renderProps.props}> </div>
                        </Tooltip>
                      );
                    }}
                  />
                </div>
                <hr className="my-5" />

                <div className="mt-5">
                  <h1 className="heading">Categories</h1>
                  <ul className="pl-0">
                    {categories.map((item) => (
                      <li
                        key={item}
                        className={`filter-item ${
                          category === item ? "selected" : ""
                        }`}
                        onClick={() => toggleFilter("category", item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5">
                    <h4 className="mb-3 heading">Ratings</h4>
                    <ul className="pl-0">
                      {[1, 2, 3, 3.5, 4, 4.5, 5].map((item) => (
                        <li
                          key={item}
                          className={`filter-item ${
                            rating === item ? "selected" : ""
                          }`}
                          onClick={() => toggleFilter("rating", item)}
                        >
                          <div className="rating-outer">
                            <div
                              className="rating-inner"
                              style={{ width: `${item * 20}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <h4 className="mb-3 heading">Gender</h4>
                    <ul className="pl-0">
                      {gender.map((item) => (
                        <li
                          key={item}
                          className={`filter-item ${
                            genders === item ? "selected" : ""
                          }`}
                          onClick={() => toggleFilter("gender", item)}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>

          {productsCount > 0 && productsCount > resPerPage ? (
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
          ) : null}

          {productsCount == 0 ? (
            <h1 className="d-flex justify-content-center headings">
              No Products Found!
            </h1>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
};
