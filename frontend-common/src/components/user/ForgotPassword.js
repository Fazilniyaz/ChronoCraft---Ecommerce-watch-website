import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, forgotPassword } from "../../actions/userActions";
import { useEffect } from "react";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.authState);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (message) {
      toast(message, {
        type: "success",
        position: "bottom-center",
      });
      setEmail("");
      return;
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
  }, [message, error, dispatch]);

  return (
    <div>
      <div classname="row wrapper">
        <div classname="col-10 col-lg-5">
          <form onSubmit={submitHandler} classname="shadow-lg">
            <h1 classname="mb-3">Forgot Password</h1>
            <div classname="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                id="email_field"
                classname="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              classname="btn btn-block py-3"
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
