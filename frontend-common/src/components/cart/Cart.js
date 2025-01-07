import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  decreaseCartItemQty,
  increaseCartItemQty,
  removeItemFromCart,
} from "../../slices/cartSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

export default function Cart() {
  const { items } = useSelector((state) => state.cartState);
  const { products } = useSelector((state) => state.productsState);
  const { user = "" } = useSelector((state) => state.authState);

  // const [cartItems, setCartItems] = useState([]);
  console.log(user);

  console.log(products);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate(`/login?redirect=shipping`);
  };

  // useEffect(() => {
  //   async function getAllItemsFromAParticularUser() {
  //     const { data } = await axios.get(
  //       `/api/v1/CartProductsOfSingleUser/${user._id}`
  //     );
  //     console.log(data);
  //     setCartItems(data);
  //   }
  //   getAllItemsFromAParticularUser();
  // }, []);

  return (
    <Fragment>
      {items.length == 0 ? (
        <h2 className="mt-5 headings">Your cart is Empty</h2>
      ) : (
        <Fragment>
          <h2 className="mt-5 headings mb-3">
            Your Cart : <b>{items.length} items</b>
          </h2>
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              {items.map((item, k) => (
                <Fragment>
                  <hr />
                  <div className="cart-item">
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          height="90"
                          width="115"
                        />
                      </div>

                      <div className="col-5 col-lg-3">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price">{"$" + item.price}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-inline">
                          <span
                            onClick={() => {
                              // Assuming there's only one element with the class 'count'
                              const inputElement =
                                document.getElementsByClassName("count")[k];
                              const count = inputElement
                                ? inputElement.value
                                : 1;
                              console.log(count);

                              if (count > 1) {
                                dispatch(decreaseCartItemQty(item.product));
                              }
                            }}
                            className="btn btn-danger minus"
                          >
                            -
                          </span>
                          <input
                            type="number"
                            className="form-control count d-inline"
                            value={item.quantity < 0 ? "1" : item.quantity}
                            readOnly
                          />

                          <span
                            onClick={() =>
                              // dispatch(increaseCartItemQty(item.product))
                              {
                                var originalName = `${item.name}`;
                                console.log(originalName);
                                var watch = products.map((item, i) => {
                                  if (originalName == item.name) {
                                    return item.name;
                                  }
                                });
                                console.log(watch);
                                const inputElement =
                                  document.getElementsByClassName("count")[k];
                                const count = inputElement
                                  ? inputElement.value
                                  : 0;
                                console.log(count);
                                let originalCount;
                                for (var i = 0; i < products.length; i++) {
                                  if (products[i].name == `${item.name}`) {
                                    originalCount = products[i].stock;
                                    break;
                                  }
                                }
                                if (
                                  watch.includes(originalName) &&
                                  count < originalCount
                                ) {
                                  dispatch(increaseCartItemQty(item.product));
                                } else {
                                  toast("Maximum stock reached", {
                                    position: "bottom-center",
                                  });
                                }
                              }
                            }
                            className="btn btn-primary plus"
                          >
                            +
                          </span>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <i
                          id="delete_cart_item"
                          onClick={() =>
                            dispatch(removeItemFromCart(item.product))
                          }
                          className="fa fa-trash btn btn-danger"
                        ></i>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}

              <hr />
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:{" "}
                  <span className="order-summary-values">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    (Units)
                  </span>
                </p>
                <p>
                  Est. total:{" "}
                  <span className="order-summary-values">
                    {items.reduce(
                      (acc, item) => acc + item.quantity * item.price,
                      0
                    )}
                  </span>
                </p>

                <hr />
                <button
                  id="checkout_btn"
                  onClick={checkoutHandler}
                  className="btn btn-primary btn-block"
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
