import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { validateShipping } from "./Shipping";
import { Link } from "react-router-dom";
import Loader from "../layouts/Loader";
import CheckoutSteps from "./CheckoutSteps";
import axios from "axios";

function ConfirmOrder() {
  const { shippingInfo, items: cartItems } = useSelector(
    (state) => state.cartState
  );
  const [cartItemsFromDB, setCartItemsFromDB] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const { user } = useSelector((state) => state.authState);
  const navigate = useNavigate();
  console.log(cartItemsFromDB);
  let products = cartItemsFromDB.map((item, i) => {
    return {
      _id: item.productId._id,
      quantity: item.quantity,
      stock: item.stock,
    };
  });

  console.log(products);
  const itemsPrice = cartItemsFromDB.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  let taxPrice = Number(0.15 * itemsPrice);
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  taxPrice = Number(taxPrice).toFixed(2);

  const processPayment = () => {
    const data = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      products,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };
  const processPaymentViaPaypal = () => {
    const data = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      products,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/paymentViaPaypal");
  };
  const processPaymentWallet = () => {
    const data = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      products,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/paymentViaWallet");
  };
  const processPaymentCOD = () => {
    const data = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      products,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/paymentViaCOD");
  };

  const userId = user._id;

  useEffect(() => {
    validateShipping({ shippingInfo, navigate });
    async function getAllCartItemsOfTheParticularUser() {
      try {
        const { data } = await axios.get(
          `/api/v1/CartProductsOfSingleUser/${userId}`
        );
        setCartItemsFromDB(data.cartItems);
        setIsLoading(false); // Data fetched, stop loading
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setIsLoading(false); // Stop loading even on error
      }
    }
    getAllCartItemsOfTheParticularUser();
  }, [userId, navigate, shippingInfo]);

  if (isLoading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <Fragment>
      <MetaData title={"Confirm Order"} />
      <CheckoutSteps shipping confirmOrder />
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3 headings">Shipping Info</h4>
          <p className="mb-2 mt-2">
            <b>Name: </b> {user.name}
          </p>
          <p className=" mb-2">
            <b>Phone: </b>
            {shippingInfo.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
            {shippingInfo.postalCode}, {shippingInfo.state},{" "}
            {shippingInfo.country}{" "}
          </p>

          <hr />
          <h4 className="mt-4 mb-4 headings">Your Cart Items:</h4>
          {cartItemsFromDB.map((item) => (
            <Fragment key={item._id}>
              <div className="cart-item my-1 m-4">
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img
                      src={item.productId.images[0].image}
                      alt={item.itemName}
                      height="45"
                      width="65"
                    />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.productId._id}`}>
                      {item.itemName}
                    </Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item.quantity} x ${item.finalPrice} ={" "}
                      <b>${item.quantity * item.finalPrice}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
            </Fragment>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4 className="smallHeadings mb-4">Order Summary</h4>
            <hr />
            <p className="m-3">
              Subtotal:{" "}
              <span className="order-summary-values">${itemsPrice}</span>
            </p>
            <p className="m-3">
              Shipping:{" "}
              <span className="order-summary-values">${shippingPrice}</span>
            </p>
            <p className="m-3">
              Tax: <span className="order-summary-values">${taxPrice}</span>
            </p>

            <hr />

            <p className="m-3">
              Total: <span className="order-summary-values">${totalPrice}</span>
            </p>
            <hr />

            <p className="m-2 stock-3">Proceed to Payment</p>

            <hr />
            <button
              id="checkout_btn"
              onClick={processPayment}
              className="btn btn-primary btn-block"
            >
              via Stripe
            </button>
            <button
              id="checkout_btn"
              onClick={processPaymentViaPaypal}
              className="btn btn-primary btn-block"
            >
              via PayPal
            </button>
            <button
              id="checkout_btn"
              onClick={processPaymentCOD}
              className="btn btn-primary btn-block"
              disabled={totalPrice < 1000 ? true : false}
            >
              {totalPrice < 1000 ? "COD Not Available" : "Cash On Delivery"}
            </button>
            <button
              id="checkout_btn"
              onClick={processPaymentWallet}
              className="btn btn-primary btn-block"
            >
              Utilize Wallet
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ConfirmOrder;
