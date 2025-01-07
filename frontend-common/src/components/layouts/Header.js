import React, { Fragment } from "react";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DropdownButton, Dropdown, Image } from "react-bootstrap";
import { logout } from "../../actions/userActions";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function Header() {
  const { isAuthenticated, user = "" } = useSelector(
    (state) => state.authState
  );
  const { items: cartItems } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout);
  };

  const userId = user._id;

  const [cartData, setCartData] = useState([]);
  const [boolean, setBoolean] = useState(false);
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user && userId) {
        try {
          const { data } = await axios.get(
            `/api/v1/CartProductsOfSingleUser/${userId}`
          );
          setCartData(data.cartItems);
          setBoolean(true);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      } else {
        return;
      }
    };

    fetchCartItems();
  }, [boolean]);

  const navigate = useNavigate();

  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div id="brand-display" className="navbar-brand">
            <img src="/images/logo.png" height="50px" width="50px" />
            <Link to="/">
              {" "}
              <h1 id="brand-display" className="text-logo">
                ChronoCraft
              </h1>
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          {isAuthenticated ? (
            <Dropdown className="d-inline">
              <Dropdown.Toggle
                variant="default text-white pr-5"
                id="dropdown-basic"
              >
                <figure className="avatar avatar-nav">
                  <Image
                    width="50px"
                    src={user.avatar ?? "./images/default_avatar.png"}
                  />
                </figure>
                <span>{user.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* Profile */}
                <Dropdown.Item
                  onClick={() => {
                    navigate("/myProfile");
                  }}
                  className="text-dark"
                >
                  Profile
                </Dropdown.Item>

                {/* Cart */}
                <Dropdown.Item className="text-dark">
                  <Link to="/cart">Cart</Link>
                  <span className="ml-1" id="cart_count">
                    {cartData.length}
                  </span>
                </Dropdown.Item>
                {/* WishList */}
                <Dropdown.Item className="text-dark">
                  <Link to="/WishList">WishList</Link>
                </Dropdown.Item>

                {/* Dashboard */}
                {user.role === "admin" && (
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/admin/dashboard");
                    }}
                    className="text-blue"
                  >
                    Dashboard
                  </Dropdown.Item>
                )}

                {/* Orders */}
                <Dropdown.Item
                  onClick={() => {
                    navigate("/orders");
                  }}
                  className="text-dark"
                >
                  Orders
                </Dropdown.Item>
                {/* Wallet */}
                <Dropdown.Item
                  onClick={() => {
                    navigate("/getWalletBalance");
                  }}
                  className="text-dark"
                >
                  Wallet
                </Dropdown.Item>

                {/* Logout */}
                <Dropdown.Item onClick={logoutHandler} className="text-danger">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link to="/login">
              <button className="btn" id="login_btn">
                Login
              </button>
            </Link>
          )}

          {/* <span id="cart" className="ml-3">
    Cart
  </span>
  <span className="ml-1" id="cart_count">
    2
  </span> */}
        </div>
      </nav>
    </Fragment>
  );
}

export default Header;
