import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../layouts/Loader";
// import Product from "./product/Product";
import Product from "../product/Product";

export default function WishList() {
  const { user = "" } = useSelector((state) => state.authState);
  const userId = user._id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWishlistedProducts() {
      try {
        const { data } = await axios.get(`/api/v1/getUserWishList/${userId}`);
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setLoading(false);
      }
    }
    getWishlistedProducts();
  }, [userId]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="headings">Your Wish List</h2>
          <section id="wishlist" className="container mt-5">
            <div className="row">
              {products.length > 0 ? (
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))
              ) : (
                <p className="text-center">Your wish list is empty.</p>
              )}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
}
