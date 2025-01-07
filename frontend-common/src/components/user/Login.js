import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, login } from "../../actions/userActions";
import MetaData from "../../components/layouts/MetaData";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthError } from "../../actions/userActions";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );

  const redirect = location.search ? "/" + location.search.split("=")[1] : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Enter all the fields", {
        position: "bottom-center",
        type: "error",
      });
      return;
    }
    try {
      dispatch(login(email, password));
    } catch (err) {
      toast(err.response.data.message, {
        type: "error",
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError);
        },
      });
      return;
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  return (
    <Fragment>
      <MetaData title={"Login page"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-3">Login</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <Link to="/password/forgot" className="float-right mb-4">
              Forgot Password?
            </Link>

            <button
              id="login_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              LOGIN
            </button>

            <GoogleLogin
              id="login_button"
              className="btn btn-block py-3"
              style={{ margin: "10px" }}
              disabled={loading}
              onSuccess={(credentialResponse) => {
                try {
                  // Decode the Google credential (optional, for debugging or extracting user info)
                  const decoded = jwtDecode(credentialResponse.credential);
                  console.log("Decoded Google Credential:", decoded);
                  console.log(decoded.email);
                  // googleLogin(decoded.email);

                  dispatch(login(decoded.email, null));
                  toast.success("Google Sign-In successful!");
                } catch (err) {
                  console.error("Google Sign-In Error:", err);
                  toast.error(
                    err.response?.data?.message || "Google Sign-In failed!"
                  );
                }
              }}
              onError={() => {
                console.log("Login failed");
              }}
            />
            <Link to="/register">
              <p className="float-right mt-3">New User?</p>
            </Link>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
