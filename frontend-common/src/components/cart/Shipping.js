// import { Fragment } from "react";
// import { useState } from "react";
// import { countries } from "countries-list";
// import { useDispatch, useSelector } from "react-redux";
// import { saveShippingInfo } from "../../slices/cartSlice";
// import { useNavigate } from "react-router-dom";
// import CheckoutSteps from "./CheckoutSteps";
// import { toast } from "react-toastify";

// export const validateShipping = ({ shippingInfo, navigate }) => {
//   console.log(shippingInfo);
//   if (
//     !shippingInfo.address ||
//     !shippingInfo.city ||
//     !shippingInfo.state ||
//     !shippingInfo.country ||
//     !shippingInfo.phoneNo ||
//     !shippingInfo.postalCode
//   ) {
//     toast.error("Please fill the shipping information", {
//       position: "bottom-center",
//     });
//     navigate("/shipping");
//   }
// };

// export default function Shipping() {
//   const { shippingInfo = {} } = useSelector((state) => state.cartState);

//   const { user = "" } = useSelector((state) => state.authState);

//   console.log(user);

//   const [address, setAddress] = useState(shippingInfo.address);
//   const [city, setCity] = useState(shippingInfo.city);
//   const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
//   const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
//   const [country, setCountry] = useState(shippingInfo.country);
//   const [state, setState] = useState(shippingInfo.state);
//   const countryList = Object.values(countries);
//   const [existingAddresses, setExistingAddress] = useState([]);
//   const [boolean, setBoolean] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(
//       saveShippingInfo({ address, city, phoneNo, postalCode, country, state })
//     );
//     navigate(`/order/confirm`);
//   };

//   console.log(user.addresses);

//   return (
//     <Fragment>
//       <CheckoutSteps shipping />
//       <div className="row wrapper">
//         <div className="col-10 col-lg-5">
//           <form onSubmit={submitHandler} className="shadow-lg">
//             <h1 className="mb-4">Shipping Info</h1>
//             <div className="form-group">
//               <label htmlFor="address_field">Address</label>
//               <input
//                 type="text"
//                 id="address_field"
//                 className="form-control"
//                 value={address}
//                 onChange={(e) => {
//                   setAddress(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="city_field">City</label>
//               <input
//                 type="text"
//                 id="city_field"
//                 className="form-control"
//                 value={city}
//                 onChange={(e) => {
//                   setCity(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="phone_field">Phone No</label>
//               <input
//                 type="phone"
//                 id="phone_field"
//                 className="form-control"
//                 value={phoneNo}
//                 onChange={(e) => {
//                   setPhoneNo(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="postal_code_field">Postal Code</label>
//               <input
//                 type="number"
//                 id="postal_code_field"
//                 className="form-control"
//                 value={postalCode}
//                 onChange={(e) => {
//                   setPostalCode(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="country_field">Country</label>
//               <select
//                 id="country_field"
//                 className="form-control"
//                 value={country}
//                 onChange={(e) => setCountry(e.target.value)}
//                 required
//               >
//                 {countryList.map((country, i) => (
//                   <option key={i} value={country.name}>
//                     {country.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="state_field">State</label>
//               <input
//                 type="text"
//                 id="state_field"
//                 className="form-control"
//                 value={state}
//                 onChange={(e) => setState(e.target.value)}
//                 required
//               />
//             </div>

//             <button
//               id="shipping_btn"
//               type="submit"
//               className="btn btn-block py-3"
//             >
//               CONTINUE
//             </button>
//           </form>
//         </div>
//       </div>
//     </Fragment>
//   );
// }

import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from "react-toastify";
import { countries } from "countries-list";
import axios from "axios";

export const validateShipping = ({ shippingInfo, navigate }) => {
  console.log(shippingInfo);
  if (
    !shippingInfo.address ||
    !shippingInfo.city ||
    !shippingInfo.state ||
    !shippingInfo.country ||
    !shippingInfo.phoneNo ||
    !shippingInfo.postalCode
  ) {
    toast.error("Please fill the shipping information", {
      position: "bottom-center",
    });
    navigate("/shipping");
  }
};
export default function Shipping() {
  const { shippingInfo = {} } = useSelector((state) => state.cartState);
  const { user = "" } = useSelector((state) => state.authState);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [phoneForExistingAddress, setPhoneForExistingAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countryList = Object.values(countries);

  const handleExistingAddressSelect = (address) => {
    setSelectedAddress(address);
    setAddress(address.addressLine);
    setCity(address.city);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setState(address.state);
    setUseExistingAddress(true);
  };

  const handleExistingAddressSubmit = () => {
    if (!selectedAddress) {
      toast.error("Please select an existing address!", {
        position: "bottom-center",
      });
      return;
    }
    if (!phoneForExistingAddress) {
      toast.error("Please provide a phone number for the selected address!");
      return;
    }
    dispatch(
      saveShippingInfo({
        address: selectedAddress.addressLine,
        city: selectedAddress.city,
        phoneNo: phoneForExistingAddress,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        state: selectedAddress.state,
      })
    );
    navigate(`/order/confirm`);
  };

  const handleNewAddressSubmit = (e) => {
    e.preventDefault();
    const currentShippingInfo = {
      address,
      city,
      phoneNo,
      postalCode,
      country,
      state,
    };

    const addressForm = {
      addressLine: address,
      city,
      postalCode,
      country,
      state,
    };

    let userAddedExistingAddress = false;

    user.addresses.map((item, i) => {
      if (address == item.addressLine) {
        toast("Address Already exists!", {
          type: "error",
          position: "bottom-center",
        });
        userAddedExistingAddress = true;
        return;
      }
    });

    // if (!validateShipping(currentShippingInfo)) {
    //   toast.error("Please fill in all required fields!");
    //   return;
    // }
    if (userAddedExistingAddress == false) {
      async function addNewAddress() {
        await axios.post("/api/v1/createAddress", addressForm);
        toast("Address Created Successfully!", {
          position: "bottom-center",
        });
      }
      addNewAddress();
      dispatch(saveShippingInfo(currentShippingInfo));
      navigate(`/order/confirm`);
    }
  };

  return (
    <Fragment>
      <CheckoutSteps shipping />
      <div className="row wrapper">
        <div className="col-12">
          <h1 className="mb-4 headings">Shipping Info</h1>

          {/* Existing Addresses */}
          {user && user.addresses && user.addresses.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-4 smallHeadings">Select an Existing Address</h2>
              {user.addresses.map((item, i) => (
                <div key={i} className="mb-3">
                  <input
                    type="radio"
                    id={`address-${i}`}
                    name="existingAddress"
                    value={i}
                    onChange={() => handleExistingAddressSelect(item)}
                    checked={selectedAddress === item}
                  />
                  <label htmlFor={`address-${i}`} className="ml-2">
                    {`${item.addressLine}, ${item.city}, ${item.state}, ${item.country}, ${item.postalCode}`}
                  </label>
                </div>
              ))}
              {useExistingAddress && (
                <div className="form-group mt-3">
                  <label htmlFor="phone_existing_field">
                    Phone No (for existing address)
                  </label>
                  <input
                    type="phone"
                    id="phone_existing_field"
                    className="form-control"
                    value={phoneForExistingAddress}
                    onChange={(e) => setPhoneForExistingAddress(e.target.value)}
                    required
                  />
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={handleExistingAddressSubmit}
              >
                Continue with Selected Address
              </button>
              <button
                className="btn btn-secondary ml-3"
                onClick={() => setUseExistingAddress(false)}
              >
                Enter a New Address
              </button>
              <span className="stock-2 ml-3">
                The New Address would be saved in Your Profile
              </span>
            </div>
          )}

          {/* New Address Form */}
          {!useExistingAddress && (
            <form onSubmit={handleNewAddressSubmit} className="shadow-lg">
              <div className="form-group">
                <label htmlFor="address_field">Address</label>
                <input
                  type="text"
                  id="address_field"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city_field">City</label>
                <input
                  type="text"
                  id="city_field"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_field">Phone No</label>
                <input
                  type="phone"
                  id="phone_field"
                  className="form-control"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code_field">Postal Code</label>
                <input
                  type="number"
                  id="postal_code_field"
                  className="form-control"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="country_field">Country</label>
                <select
                  id="country_field"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  {countryList.map((country, i) => (
                    <option key={i} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="state_field">State</label>
                <input
                  type="text"
                  id="state_field"
                  className="form-control"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              <button
                id="new_address_btn"
                type="submit"
                className="btn btn-block py-3"
              >
                Continue with New Address
              </button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
}
