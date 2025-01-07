import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, register, verifyOtp } from "../../actions/userActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );

  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  );

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("name", userData.name);
  //   formData.append("email", userData.email);
  //   formData.append("password", userData.password);
  //   formData.append("avatar", avatar);
  //   let email = userData.email;
  //   dispatch(verifyOtp({ email }));
  //   console.log("verifyOtp called");
  //   navigate("/otp-verification", { state: { userData: formData } });
  //   // dispatch(register(formData));
  // };

  const validateName = (name) => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!", { position: "bottom-center" });
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!", {
        position: "bottom-center",
      });
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long, and include at least one symbol, one uppercase letter, one lowercase letter, and one number!",
        { position: "bottom-center" }
      );
      return false;
    }
    return true;
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, email, password } = userData;

    // Run validations
    if (
      !validateName(name) ||
      !validateEmail(email) ||
      !validatePassword(password)
    ) {
      return; // Stop execution if any validation fails
    }

    try {
      // Check if the email exists in the database
      const response = await axios.post("/api/v1/checkEmailExistence", {
        email,
      });

      if (!response.data.success) {
        // Show toast message if user already exists
        toast.error(response.data.message, {
          position: "bottom-center",
        });
        return;
      }

      // If email does not exist, proceed to OTP verification
      const userDataObject = {
        name,
        email,
        password,
        avatar,
      };

      dispatch(verifyOtp({ email })); // Dispatch the OTP verification action
      console.log("verifyOtp called");

      // Navigate with userDataObject in state
      navigate("/otp-verification", { state: { userData: userDataObject } });
    } catch (error) {
      // Handle server errors
      console.error("Error during email check:", error);
      toast.error("Something went wrong. Please try again later.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
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
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          onSubmit={submitHandler}
          className="shadow-lg"
          encType="multipart/form-data"
        >
          <h1 className="mb-3">Register</h1>

          <div className="form-group">
            <label htmlFor="email_field">Name</label>
            <input
              type="name"
              name="name"
              onChange={onChange}
              id="name_field"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              name="email"
              onChange={onChange}
              id="email_field"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              name="password"
              onChange={onChange}
              id="password_field"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar_upload">Avatar</label>
            <div className="d-flex align-items-center">
              <div>
                <figure className="avatar mr-3 item-rtl">
                  <img
                    src={avatarPreview}
                    className="rounded-circle"
                    alt="Avatar"
                  />
                </figure>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  name="avatar"
                  onChange={onChange}
                  className="custom-file-input"
                  id="customFile"
                />
                <label className="custom-file-label" for="customFile">
                  Choose Avatar
                </label>
              </div>
            </div>
          </div>

          <button
            id="register_button"
            type="submit"
            className="btn btn-block py-3"
            disabled={loading}
          >
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
}
