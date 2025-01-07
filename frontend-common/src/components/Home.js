import React, { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import Loader from "./layouts/Loader";
import { useDispatch } from "react-redux";
import { getProducts } from "../actions/productActions";
import { useSelector } from "react-redux";
import Product from "./product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import { logout } from "../actions/userActions";

export const Home = () => {
  const dispatch = useDispatch();
  const { user = "" } = useSelector((state) => state.authState);
  console.log("User", user);
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState
  );
  console.log("products", products);
  console.log(currentPage);
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (user && user.blocked == true) {
      toast("You are Blocked by the Admin");
      dispatch(logout);
    }
    if (error) {
      return toast.error(error, {
        position: "bottom-center", //
      });
    }
    dispatch(getProducts(null, null, null, null, currentPage));
  }, [error, dispatch, currentPage, user]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <p className="headings">Latest Arrivals</p>
          {/* <h1 id="products_heading">Latest Products</h1> */}

          <section id="products" className="container mt-5">
            <div className="row">
              {/* Passing products as a prop to Product component */}
              {/* <Product products={products} /> */}
              {products &&
                products.map((product) =>
                  product.disabled == false ? (
                    <Product key={product._id} product={product} />
                  ) : (
                    ""
                  )
                )}
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
        </Fragment>
      )}
    </Fragment>
  );
};
