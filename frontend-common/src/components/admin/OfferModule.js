import React, { useState, useEffect } from "react";
import axios from "axios";

function OfferModule() {
  const [offerPercentage, setOfferPercentage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);

  // Fetch categories from the backend (this could be static if you have predefined categories)
  useEffect(() => {
    axios
      .get("/api/v1/admin/category") // Adjust endpoint to fetch categories

      .then((response) => {
        setCategories(response.data.categories);
        console.log(response);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send offer data to the backend
    axios
      .post("/api/v1/admin/applyOffer", { offerPercentage, category })
      .then((response) => {
        console.log("Offer Applied: ", response.data);
        // Optionally, fetch the updated offers after successful submission
      })
      .catch((error) => console.error("Error applying offer:", error));
  };

  const fetchOffers = () => {
    axios
      .get("/api/v1/admin/getOffers")
      .then((response) => setOffers(response.data))
      .catch((error) => console.error("Error fetching offers:", error));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div>
      <h2>Offer Module</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Offer Percentage</label>
          <input
            type="number"
            value={offerPercentage}
            onChange={(e) => setOfferPercentage(e.target.value)}
            placeholder="Enter Offer Percentage"
          />
        </div>
        <div>
          <label>Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="">Select Category</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <button type="submit">Apply Offer</button>
      </form>

      <h3>Ongoing Offers</h3>
      <ul>
        {offers.map((offer, index) => (
          <li key={index}>
            {offer.category} - {offer.offerPercentage}% off
            <button>Remove Offer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OfferModule;
