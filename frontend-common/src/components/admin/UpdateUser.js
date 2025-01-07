import { Fragment, useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { blockUser, getUser, updateUser } from "../../actions/userActions";
import { clearError, clearUserUpdated } from "../../slices/userSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
// import { isErrored } from "nodemailer/lib/xoauth2";

export default function UpdateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { loading, isUserUpdated, error, user } = useSelector(
    (state) => state.userState
  );
  const { id: userId } = useParams();

  const { user: loggedUser } = useSelector((state) => state.authState);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);

    dispatch(updateUser(userId, formData));
  };

  console.log(userId);
  console.log(loggedUser._id);

  useEffect(() => {
    if (isUserUpdated) {
      toast("User Updated Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearUserUpdated()),
      });
      return;
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

    dispatch(getUser(userId));
  }, [isUserUpdated, error, dispatch, userId]);

  useEffect(() => {
    if (user && user._id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleBlockUser = () => {
    if (window.confirm("Are you sure you want to block this user?")) {
      dispatch(blockUser(userId)); // Dispatch action to block user
    }
  };

  const handleUnBlock = () => {
    async function unblock() {
      const { data } = await axios.put(`/api/v1/admin/userUnblock/${user._id}`);
      if (data.success) {
        toast("User UnBlocked successfully!", {
          type: "success",
          position: "bottom-center",
        });
      }
    }
    unblock();
  };

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <Fragment>
          <div className="wrapper my-5">
            <form
              onSubmit={submitHandler}
              className="shadow-lg"
              encType="multipart/form-data"
            >
              <h1 className="mb-4">Update User</h1>

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price_field">Email</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category_field">Role</label>
                <select
                  disabled={user._id === loggedUser._id}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-control"
                  id="category_field"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <button
                id="login_button"
                type="submit"
                disabled={loading}
                className="btn btn-block py-3"
              >
                UPDATE
              </button>
              {user._id !== loggedUser._id && user.blocked == false ? (
                <button
                  id="block_button"
                  type="button"
                  className="btn btn-danger"
                  disabled={loading}
                  onClick={handleBlockUser}
                >
                  Block User
                </button>
              ) : user._id !== loggedUser._id && user.blocked == true ? (
                <button
                  id="block_button"
                  type="button"
                  className="btn btn-danger"
                  disabled={loading}
                  onClick={handleUnBlock}
                >
                  Unblock User
                </button>
              ) : (
                ""
              )}
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
