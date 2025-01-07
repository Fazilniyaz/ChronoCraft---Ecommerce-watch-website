import { Fragment, useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/productSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState(0);
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [strapMaterial, setStrapMaterial] = useState("");
  const [dialColor, setDialColor] = useState("");
  const [productFunction, setProductFunction] = useState("");
  const [images, setImages] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);

  const { loading, isProductUpdated, error, product } = useSelector(
    (state) => state.productState
  );
  const { id: productId } = useParams();

  // const categories = ["Automatic", "Edge", "Mechanical", "Smart", "Trending"];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("collection", collection);
    formData.append("brand", brand);
    formData.append("gender", gender);
    formData.append("strapMaterial", strapMaterial);
    formData.append("dialColor", dialColor);
    formData.append("function", productFunction);
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("imagesCleared", imagesCleared);

    dispatch(updateProduct(productId, formData));
  };

  const clearImagesHandler = () => {
    setImages([]);
    setImagesPreview([]);
    setImagesCleared(true);
  };

  useEffect(() => {
    // Fetch categories dynamically
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/category");
        if (data.success) {
          console.log(data);

          setCategories(data.categories);
        } else {
          toast.error("Failed to fetch categories.");
        }
      } catch (error) {
        toast.error("Error fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isProductUpdated) {
      toast("Product Updated Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductUpdated()),
      });
      setImages([]);
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

    dispatch(getProduct(productId));
  }, [isProductUpdated, error, dispatch, productId]);

  useEffect(() => {
    console.log("product", product);
    if (product && product._id) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setCollection(product.collection);
      setCategory(product.category);
      setBrand(product.brand);
      setGender(product.gender);
      setStrapMaterial(product.strapMaterial);
      setDialColor(product.dialColor);
      setProductFunction(product.function);

      let images = [];
      product.images.forEach((image) => {
        images.push(image.image);
      });
      setImagesPreview(images);
    }
  }, [product]);

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
              <h1 className="mb-4">Update Product</h1>

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
                <label htmlFor="price_field">Price</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description_field">Description</label>
                <textarea
                  className="form-control"
                  id="description_field"
                  rows="8"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category_field">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  id="category_field"
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="form-group">
                <label htmlFor="stock_field">Stock</label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  onChange={(e) => setStock(Number(e.target.value))}
                  value={stock}
                />
              </div>

              {/* Additional Fields */}
              <div className="form-group">
                <label htmlFor="collection_field">Collection</label>
                <input
                  type="text"
                  id="collection_field"
                  className="form-control"
                  onChange={(e) => setCollection(e.target.value)}
                  value={collection}
                />
              </div>

              <div className="form-group">
                <label htmlFor="brand_field">Brand</label>
                <input
                  type="text"
                  id="brand_field"
                  className="form-control"
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender_field">Gender</label>
                <input
                  type="text"
                  id="gender_field"
                  className="form-control"
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                />
              </div>

              <div className="form-group">
                <label htmlFor="strapMaterial_field">Strap Material</label>
                <input
                  type="text"
                  id="strapMaterial_field"
                  className="form-control"
                  onChange={(e) => setStrapMaterial(e.target.value)}
                  value={strapMaterial}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dialColor_field">Dial Color</label>
                <input
                  type="text"
                  id="dialColor_field"
                  className="form-control"
                  onChange={(e) => setDialColor(e.target.value)}
                  value={dialColor}
                />
              </div>

              <div className="form-group">
                <label htmlFor="function_field">Function</label>
                <input
                  type="text"
                  id="function_field"
                  className="form-control"
                  onChange={(e) => setProductFunction(e.target.value)}
                  value={productFunction}
                />
              </div>

              {/* Images */}
              <div className="form-group">
                <label>Images</label>
                <div className="custom-file">
                  <input
                    type="file"
                    name="product_images"
                    className="custom-file-input"
                    id="customFile"
                    multiple
                    onChange={onImagesChange}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Images
                  </label>
                </div>
                {imagesPreview.length > 0 && (
                  <span
                    onClick={clearImagesHandler}
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-trash"></i>
                  </span>
                )}
                {imagesPreview.map((image) => (
                  <img
                    className="mt-3 mr-2"
                    key={image}
                    src={image}
                    alt={`Image Preview`}
                    width="55"
                    height="52"
                  />
                ))}
              </div>

              <button
                id="login_button"
                type="submit"
                disabled={loading}
                className="btn btn-block py-3"
              >
                UPDATE
              </button>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
