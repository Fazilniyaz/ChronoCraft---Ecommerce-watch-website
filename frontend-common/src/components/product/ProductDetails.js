import React, { Fragment, useEffect, useState } from "react";
import { createReview, getProduct } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Carousel } from "react-bootstrap";
import { addCartItem, addCartItemInDB } from "../../actions/cartActions";
import { Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  clearReviewSubmitted,
  clearError,
  clearProduct,
} from "../../slices/productSlice";
import ProductReview from "./ProductReview";
import axios from "axios";
import { continents } from "countries-list";

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [boolean, setBoolean] = useState(false);
  const [products, setProducts] = useState([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [correctCoupon, setCorrectCoupon] = useState(false);
  // const [loading, setLoading] = useState(true);
  const reviewHandler = () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", id);
    dispatch(createReview(formData));
  };

  const { items } = useSelector((state) => state.cartState);
  console.log(items);

  let disabling = false;
  let btntext = "Add to Cart";

  if (
    items.map((item, i) => {
      if (item.product == id) {
        disabling = true;
        btntext = "Already added to Cart!";
      }
    })
  )
    cartItems.map((item, i) => {
      console.log("map started");
      console.log(item);
      if (item.productId._id == id) {
        disabling = true;
        btntext = "Already added to Cart!";
        console.log("map ended");
      }
    });

  console.log(disabling);
  console.log(btntext);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= product.stock) {
      toast("Maximum stock reached!", {
        type: "error",
        position: "bottom-center",
      });
    }
    if (product.stock !== 0 && count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber == 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  console.log(cartItems);

  const {
    loading,
    product = {},
    isReviewSubmitted,
    error,
  } = useSelector((state) => state.productState);
  console.log(product);

  const { user = "" } = useSelector((state) => state.authState);
  console.log(user);
  const userId = user?._id;
  console.log(product);

  let originalPrice;
  if (correctCoupon && product != {}) {
    originalPrice =
      Number(product.price) - Number(product.price) * (coupon / 100);
  }

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/CartProductsOfSingleUser/${userId}`
        );
        setCartItems(data.cartItems);
        setBoolean(true);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    async function getWishlistedProducts() {
      try {
        const { data } = await axios.get(`/api/v1/getUserWishList/${userId}`);
        console.log(data, "WishListedItems");
        setProducts(data.products);
        // setLoading(false);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        // setLoading(false);
      }
    }
    getWishlistedProducts();
    fetchCartItems();
  }, [boolean]);

  async function AddToWishList(userId, productId) {
    const { data } = await axios.post(`/api/v1/addToWishList`, {
      userId,
      productId,
    });
    setBoolean(false);
    setBoolean(true);
    toast("Product Added to WishList Successfully!", {
      type: "success",
      position: "bottom-center",
    });
  }
  async function RemoveProductFromWishList(userId, productId) {
    const { data } = await axios.post(`/api/v1/deleteProductFromWishList`, {
      userId,
      productId,
    });
    setBoolean(false);
    setBoolean(true);
    toast("Product Deleted from WishList!", {
      type: "success",
      position: "bottom-center",
    });
  }

  let iteminWishList = false;
  for (var i = 0; i < products.length; i++) {
    console.log("ProductID :", "ID inparams");
    console.log(products[i]._id, id);
    if (products[i]._id == id) {
      iteminWishList = true;
      break;
    }
  }

  let WishListButton;

  if (iteminWishList) {
    WishListButton = (
      <button
        onClick={() => {
          RemoveProductFromWishList(userId, product._id);
        }}
        className="btn btn-primary d-inline ml-2 mt-3 mb-3"
      >
        Remove From WishList
      </button>
    );
  } else {
    WishListButton = (
      <button
        onClick={() => {
          AddToWishList(userId, product._id);
        }}
        className="btn btn-primary d-inline ml-2 mt-3 mb-3"
      >
        Add to WishList
      </button>
    );
  }

  let couponAlreadyApplied = false;

  async function ApplyCoupons(e) {
    e.preventDefault();
    let ids = document.getElementById("couponCode");

    if (ids.value.trim() == "") {
      toast("Enter the coupon before submitting the form!", {
        type: "error",
        position: "bottom-center",
      });
      return;
    }
    try {
      const { data } = await axios.post(`/api/v1/applyCoupons`, {
        code: ids.value,
        userId,
        productId: product._id,
      });
      if (data.success == true) {
        setCoupon(data.discount);
        setCouponApplied(true);
        setCorrectCoupon(true);
        toast("Coupon Appliead Successfully", {
          type: "success",
          position: "bottom-center",
        });
      } else {
        toast("Incorrect Coupon", {
          type: "error",
          position: "bottom-center",
        });
        return;
      }
    } catch (err) {
      toast(err.response.data.message, {
        type: "error",
        position: "bottom-center",
      });
    }
  }

  useEffect(() => {
    if (isReviewSubmitted) {
      handleClose();
      toast("Review Submitted Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearReviewSubmitted()),
      });
    }

    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    if (!product._id || isReviewSubmitted) {
      dispatch(getProduct(id));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id, isReviewSubmitted, error]);

  let overallPrice;

  if (correctCoupon) {
    overallPrice = originalPrice;
  } else {
    overallPrice = product.price;
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images &&
                  product.images.length > 0 &&
                  product.images.map((image) => (
                    <Carousel.Item key={image._id}>
                      <img
                        className="d-block w-100"
                        src={image.image}
                        alt={product.name}
                        height="500"
                        width="500"
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">{product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{
                    width: `${(product.ratings / 5) * 100}%`,
                  }}
                ></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

              <hr />

              <p id="product_price">
                ${correctCoupon ? originalPrice : product.price}
              </p>
              <div className="stockCounter d-inline">
                {disabling == false && (
                  <span onClick={decreaseQty} className="btn btn-danger minus">
                    -
                  </span>
                )}

                {disabling == false && (
                  <input
                    type="number"
                    className="form-control count d-inline"
                    value={product.stock == 0 ? 0 : quantity}
                    readOnly
                  />
                )}
                {disabling == false && (
                  <span onClick={increaseQty} className="btn btn-primary plus">
                    +
                  </span>
                )}
              </div>
              <button
                type="button"
                id="cart_btn"
                onClick={() => {
                  dispatch(
                    addCartItemInDB(
                      product._id,
                      quantity,
                      user._id,
                      product.name,
                      overallPrice
                    )
                  );
                  toast("Cart Item Added!", {
                    type: "success",
                    position: "bottom-center",
                  });
                  // dispatch(addCartItem(product._id, quantity));
                  // dispatch(addCartItemWithUser(product._id,quantity, product.stock,user._id ))
                }}
                className="btn btn-primary d-inline ml-2 mt-3 mb-3"
                disabled={
                  product.stock == 0 || !user || disabling ? true : false
                }
              >
                {user ? `${btntext}` : "Login to use your Cart & WishList!"}
              </button>

              <hr />

              {user && userId ? WishListButton : ""}

              <hr />

              <p>
                Status:{" "}
                <span
                  className={product.stock > 0 ? "greenColor" : "redColor"}
                  id="stock_status"
                >
                  {/* <span id="stock_status"> */}
                  {product.stock > 0 ? "In Stock" : "Out of Stocks"}
                  {/* In Stock */}
                </span>
              </p>

              <hr />
              <h4 className="mt-2 mb-2 stock">{product.stock} stocks left!</h4>
              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Sold by: <strong>Amazon</strong>
              </p>
              {user ? (
                <button
                  id="review_btn"
                  type="button"
                  className="btn btn-primary mt-4"
                  data-toggle="modal"
                  onClick={handleShow}
                  data-target="#ratingModal"
                >
                  Submit Your Review
                </button>
              ) : (
                <div className="alert alert-danger mt-5">
                  Login to add Review
                </div>
              )}

              {correctCoupon == false && user != "" ? (
                <form className=" m-3">
                  <span className="stock-2">Apply Coupon : </span>{" "}
                  <input id="couponCode" type="text" className="bordered" />
                  <button
                    onClick={(e) => {
                      ApplyCoupons(e);
                    }}
                    className="m-2"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              ) : user != "" && btntext !== "Add to Cart" ? (
                <span className="stock m-5">Coupon Applied Successfully!</span>
              ) : (
                ""
              )}

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Submit your Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <li
                            value={star}
                            onClick={() => setRating(star)}
                            className={`star ${star <= rating ? "orange" : ""}`}
                            onMouseOver={(e) =>
                              e.target.classList.add("yellow")
                            }
                            onMouseOut={(e) =>
                              e.target.classList.remove("yellow")
                            }
                          >
                            <i className="fa fa-star"></i>
                          </li>
                        ))}
                      </ul>

                      <textarea
                        onChange={(e) => setComment(e.target.value)}
                        name="review"
                        id="review"
                        className="form-control mt-3"
                      ></textarea>
                      <button
                        disabled={loading}
                        onClick={reviewHandler}
                        aria-label="Close"
                        className="btn my-3 float-right review-btn px-4 text-white"
                      >
                        Submit
                      </button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {product.reviews && product.reviews.length > 0 ? (
            <ProductReview reviews={product.reviews} />
          ) : (
            ""
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default ProductDetails;
