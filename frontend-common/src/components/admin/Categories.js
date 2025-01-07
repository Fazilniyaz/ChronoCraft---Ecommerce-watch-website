import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const dispatch = useDispatch();

  // Fetch categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/category");
      setCategories(data.categories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  // Create a new category
  const createCategory = async () => {
    try {
      if (!newCategory.trim()) {
        toast.error("Category name cannot be empty");
        return;
      }
      const { data } = await axios.post("/api/v1/admin/category", {
        name: newCategory.trim(),
      });
      toast.success(data.message);
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  // Edit category
  const saveEditCategory = async () => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/category/${editingCategory._id}`,
        { name: editCategoryName.trim() }
      );
      toast.success(data.message);
      setEditingCategory(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  // Enable or disable category
  const toggleCategoryStatus = async (id, isActive) => {
    try {
      const endpoint = isActive
        ? `/api/v1/admin/category/disable/${id}`
        : `/api/v1/admin/category/enable/${id}`;
      const { data } = await axios.patch(endpoint);
      toast.success(data.message);
      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update category status"
      );
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Manage Categories</h1>

      {/* Create New Category */}
      <div className="form-group mb-4">
        <label htmlFor="newCategory">New Category:</label>
        <input
          type="text"
          id="newCategory"
          className="form-control"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={createCategory}>
          Add Category
        </button>
      </div>

      {/* Display Categories */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>
                {editingCategory?._id === category._id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>{category.isActive ? "Active" : "Inactive"}</td>
              <td>
                {editingCategory?._id === category._id ? (
                  <button
                    className="btn btn-success"
                    onClick={saveEditCategory}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setEditingCategory(category);
                      setEditCategoryName(category.name);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={`btn ${
                    category.isActive ? "btn-danger" : "btn-success"
                  } mx-2`}
                  onClick={() =>
                    toggleCategoryStatus(category._id, category.isActive)
                  }
                >
                  {category.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
