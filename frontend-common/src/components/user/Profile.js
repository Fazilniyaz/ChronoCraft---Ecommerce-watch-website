import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user } = useSelector((state) => state.authState);

  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    id: null, // null for new addresses
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch all addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/api/v1/getAllAddresses");
        setAddresses(data.addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, []);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update address
  const handleSaveAddress = async () => {
    try {
      if (isEditing) {
        await axios.put(`/api/v1/updateAddress/${addressForm.id}`, addressForm);
        toast("Address Updated Successfully!", {
          position: "bottom-center",
        });
      } else {
        await axios.post("/api/v1/createAddress", addressForm);
        toast("Address Created Successfully!", {
          position: "bottom-center",
        });
      }

      // Refresh addresses
      const { data } = await axios.get("/api/v1/getAllAddresses");
      setAddresses(data.addresses);

      // Reset form
      setAddressForm({
        id: null,
        addressLine: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`/api/v1/deleteAddress/${id}`);
      setAddresses((prev) => prev.filter((address) => address._id !== id));
      toast("Address Deleted Successfully!", {
        position: "bottom-center",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Set form for editing
  const handleEditAddress = (address) => {
    setAddressForm({ ...address, id: address._id });
    setIsEditing(true);
  };

  return (
    <div>
      <h2 className="mt-5 ml-5 headings">My Profile</h2>
      <div className="row justify-content-around mt-5 user-info">
        <div className="col-12 col-md-3">
          <figure className="avatar avatar-profile">
            <img
              className="rounded-circle img-fluid"
              src={user.avatar ?? "./images/default_avatar.png"}
              alt=""
            />
          </figure>
          <Link
            to="/myProfile/update"
            id="edit_profile"
            className="btn btn-primary btn-block my-5"
          >
            Edit Profile
          </Link>
        </div>

        <div className="col-12 col-md-5">
          <h4>Full Name</h4>
          <p>{user.name}</p>

          <h4>Email Address</h4>
          <p>{user.email}</p>

          <h4>Joined</h4>
          <p>{String(user.createdAt).substring(0, 10)}</p>

          <Link to="/orders" className="btn btn-danger btn-block mt-5">
            My Orders
          </Link>

          <Link
            to="/myProfile/update/password"
            className="btn btn-primary btn-block mt-3"
          >
            Change Password
          </Link>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="mt-5">
        <h4 className="headings mb-3">My Addresses</h4>
        <ul className="list-group">
          {addresses.map((address) => (
            <li key={address._id} className="list-group-item">
              <p>
                {address.addressLine}, {address.city}, {address.state},{" "}
                {address.country} - {address.postalCode}
              </p>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => handleEditAddress(address)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteAddress(address._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Address Form */}
        <div className="mt-4">
          <h5 className="headings mb-3">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h5>
          <div className="form-group">
            <input
              type="text"
              name="addressLine"
              value={addressForm.addressLine}
              onChange={handleFormChange}
              placeholder="Address Line"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={handleFormChange}
              placeholder="City"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="state"
              value={addressForm.state}
              onChange={handleFormChange}
              placeholder="State"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="country"
              value={addressForm.country}
              onChange={handleFormChange}
              placeholder="Country"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="postalCode"
              value={addressForm.postalCode}
              onChange={handleFormChange}
              placeholder="Postal Code"
              className="form-control"
            />
          </div>
          <button className="btn btn-success" onClick={handleSaveAddress}>
            {isEditing ? "Update Address" : "Add Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
