import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import Header from "./components/layouts/Header";
import { Footer } from "./components/layouts/Footer";
import { Home } from "./components/Home";
import { ToastContainer } from "react-toastify";
import ProductDetails from "./components/product/ProductDetails";
import { ProductSearch } from "./components/product/ProductSearch";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import store from "./store";
import { useEffect } from "react";
import { loadUser } from "./actions/userActions";
import Profile from "./components/user/Profile";
import ProtectedRoutes from "./components/route/ProtectedRoutes";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import axios from "axios";
import Payment from "./components/cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import OrderSuccess from "./components/cart/OrderSuccess";
import UserOrders from "./components/order/UserOrders";
import Dashboard from "./components/admin/DashBoard";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";
import UserList from "./components/admin/UserList";
import OrderDetail from "./components/order/OrderDetail";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderList from "./components/admin/OrderList";
import UpdateOrder from "./components/admin/UpdateOrder";
import UpdateUser from "./components/admin/UpdateUser";
import Categories from "./components/admin/Categories";
import OtpVerification from "./components/user/OtpVerification";
import { useSelector } from "react-redux";
import CartPage from "./components/cart/CartPage";
import CashOnDelivery from "./components/user/CashOnDelivery";
import WalletPage from "./components/user/Wallet";
import WishList from "./components/user/WishList";
import WalletPayment from "./components/user/WalletPayment";
import CouponForm from "./components/admin/Coupon";
import Paypal from "./components/user/PayPal";
import SalesReport from "./components/admin/SalesReport";
import OfferModule from "./components/admin/OfferModule";
import { toast } from "react-toastify";

function App() {
  const [stripeApiKey, setstripeApiKey] = useState("");

  const { user = "" } = useSelector((state) => state.authState);

  const userId = user._id;

  console.log(user);

  useEffect(() => {
    store.dispatch(loadUser);
    async function getStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapi");
        setstripeApiKey(data.stripeApiKey);
        return;
      } catch (err) {
        toast(err.response?.data?.message, {
          type: "error",
          position: "bottom-center",
        });
        return;
      }
      // try {
      // if (user && userId) {
      //   const { data } = await axios.get("/api/v1/stripeapi");
      //   setstripeApiKey(data.stripeApiKey);
      // } else {
      //   return;
      // }

      // } catch (err) {
      // console.log(err);
      // }
    }
    getStripeApiKey();
    console.log(stripeApiKey);
  }, [stripeApiKey]);

  const Layout = ({ children }) => {
    const location = useLocation();

    const noHeaderFooterPaths = ["/login", "/admin-login", "/admin-dashboard"];
    const showHeaderFooter = !noHeaderFooterPaths.includes(location.pathname);

    return (
      <>
        {showHeaderFooter && <Header />}
        <div className="container container-fluid">
          <ToastContainer theme="dark" />
          {children}
        </div>
        {showHeaderFooter && <Footer />}
      </>
    );
  };

  return (
    <Router>
      <HelmetProvider>
        <Layout>
          <div className="container container-fluid">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/search/:keyword" element={<ProductSearch />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/otp-verification" element={<OtpVerification />} />

              <Route
                path="/myProfile"
                element={
                  <ProtectedRoutes>
                    <Profile />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/myProfile/update"
                element={
                  <ProtectedRoutes>
                    <UpdateProfile />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/myProfile/update/password"
                element={
                  <ProtectedRoutes>
                    <UpdatePassword />
                  </ProtectedRoutes>
                }
              />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route
                path="/password/reset/:token"
                element={<ResetPassword />}
              />
              {/* <Route path="/cart" element={<Cart />} /> */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/WishList" element={<WishList />} />
              <Route
                path="/shipping"
                element={
                  <ProtectedRoutes>
                    <Shipping />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/order/confirm"
                element={
                  <ProtectedRoutes>
                    <ConfirmOrder />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/order/success"
                element={
                  <ProtectedRoutes>
                    <OrderSuccess />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoutes>
                    <UserOrders />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/getWalletBalance"
                element={
                  <ProtectedRoutes>
                    <WalletPage />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoutes>
                    <OrderDetail />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/paymentViaCOD"
                element={
                  <ProtectedRoutes>
                    <CashOnDelivery />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/paymentViaWallet"
                element={
                  <ProtectedRoutes>
                    <WalletPayment />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/paymentViaPaypal"
                element={
                  <ProtectedRoutes>
                    <Paypal />
                  </ProtectedRoutes>
                }
              />
              {stripeApiKey && (
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoutes>
                      <Elements stripe={loadStripe(stripeApiKey)}>
                        {" "}
                        <Payment />
                      </Elements>
                    </ProtectedRoutes>
                  }
                />
              )}
              <Route path="/admin-loginvvv" element={<AdminLogin />} />
              <Route path="/admin-dashboardvvv" element={<AdminDashboard />} />
            </Routes>
          </div>
          <div className="container container-fluid">
            <Routes>
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <Dashboard />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <ProductList />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/coupon"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <CouponForm />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/products/create"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <NewProduct />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <UserList />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <UpdateProduct />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/order/:id"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <UpdateOrder />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/user/:id"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <UpdateUser />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <OrderList />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/salesReport"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <SalesReport />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/OfferModule"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <OfferModule />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoutes isAdmin={true}>
                    <Categories />
                  </ProtectedRoutes>
                }
              />
            </Routes>
          </div>
        </Layout>
      </HelmetProvider>
    </Router>
  );
}

export default App;
