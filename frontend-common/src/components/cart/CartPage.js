import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { removeItemFromCart } from "../../slices/cartSlice";
import Loader from "../layouts/Loader";
import { Fragment } from "react";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [boolean, setBoolean] = useState(false);
  const [summary, setSummary] = useState({ totalAmount: 0, totalProducts: 0 });
  const { user = "" } = useSelector((state) => state.authState);
  const { items = [] } = useSelector((state) => state.cartState);

  const couponData = localStorage.getItem("cartItems");
  let original;

  console.log(cartData);

  const userId = user._id;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate(`/login?redirect=shipping`);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        await setBoolean(false);

        const { data } = await axios.get(
          `/api/v1/CartProductsOfSingleUser/${userId}`
        );
        await setCartData(data.cartItems);
        await setSummary(data.summary);
        await setBoolean(true);
      } catch (error) {
        await console.error("Error fetching cart data:", error);
      }
    };

    fetchCartItems();
  }, [boolean]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/deleteCartItem/${id}`);
      setCartData(cartData.filter((item) => item._id !== id));
      setBoolean(true);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  return cartData.length == 0 && !boolean && summary?.totalAmount ? (
    <Loader />
  ) : (
    <Fragment>
      {" "}
      <div className="cart-page" style={styles.cartPage}>
        {cartData.length >= 1 ? (
          <h2 style={styles.heading}>Your Cart</h2>
        ) : (
          <h2 className="mt-5 headings mb-2">Your cart is Empty</h2>
        )}
        <div style={styles.cartItems}>
          {cartData.map((item) => (
            <div key={item._id} style={styles.cartItem}>
              <img
                src={item.productId.images[0].image}
                alt={item.itemName}
                style={styles.productImage}
              />
              <div style={styles.itemDetails}>
                <Link to={`/product/${item.productId._id}`}>
                  {item.itemName}
                </Link>
                <p id="card_item_price">Price: ₹{item.finalPrice}</p>
                <p>Stock: {item.stock}</p>
                <div style={styles.quantityControls}>
                  <span>
                    No. of quantity Added :{" "}
                    <span className="mt-2 mb-2 stock">{item.quantity}</span>
                  </span>
                </div>
                <button
                  style={{ ...styles.button, ...styles.deleteButton }}
                  onClick={() => {
                    handleDelete(item._id);
                    dispatch(removeItemFromCart(item._id));
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {cartData.length >= 1 && (
          <div style={styles.orderSummary}>
            <h3 className="headings mb-3">Order Summary</h3>
            <p>Number of Products: {summary.totalProducts}</p>
            <p>Total Amount: ₹{summary.totalAmount}</p>
            <button
              disabled={cartData.length == 0 ? true : false}
              style={styles.checkoutButton}
              onClick={checkoutHandler}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

const styles = {
  cartPage: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  },
  productImage: {
    width: "100px",
    height: "100px",
    marginRight: "20px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  itemDetails: {
    flex: 1,
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "5px 10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #007bff",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    marginTop: "10px",
  },
  orderSummary: {
    marginTop: "30px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f1f1f1",
  },
  checkoutButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
};

export default CartPage;
