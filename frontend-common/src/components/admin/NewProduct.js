import { Fragment, useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewProduct } from "../../actions/productActions";
import { clearError, clearProductCreated } from "../../slices/productSlice";
import { toast } from "react-toastify";
import axios from "axios";

export default function NewProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]); // For fetched categories
  const [selectedCategory, setSelectedCategory] = useState(""); // For selected category
  const [stock, setStock] = useState(0);
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [strapMaterial, setStrapMaterial] = useState("");
  const [dialColor, setDialColor] = useState("");
  const [productFunction, setProductFunction] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/category");
        if (data.success) {
          setCategories(
            data.categories.map((cat) => {
              if (cat.isActive == true) {
                return cat.name;
              }
            })
          ); // Extract category names
        }
      } catch (error) {
        toast("Failed to load categories", {
          type: "error",
          position: "bottom-center",
        });
      }
    };

    fetchCategories();
  }, []);

  const { loading, isProductCreated, error } = useSelector(
    (state) => state.productState
  );

  // const categories = ["Automatic", "Edge", "Mechanical", "Smart", "Trending"];

  const brands = ["Titan", "Fastrack", "Sonata", "Zoop", "SF"];

  const genders = [
    "Men",
    "Women",
    "Unisex",
    "Couple",
    "Boys",
    "Girls",
    "Gents",
  ];

  const dialColors = [
    "Anthracite",
    "Beige",
    "Bicolor",
    "Bicolour",
    "Black",
    "Black MOP",
    "Blue",
    "Brown",
    "Champagne",
    "Dark Brown",
    "Digital",
    "Golden",
    "Green",
    "Green MOP",
    "Grey",
    "Gun",
    "Light Brown",
    "Light Champ",
    "Light Champange",
    "Light Rose Gold",
    "Maroon",
    "Mother Of Pearl",
    "Mother of Pearl",
    "Multicoloured",
    "NA",
    "Off White",
    "Orange",
    "Pink",
    "Pink Mother Of Pearl",
    "Purple",
    "Purple Mother Of Pearl",
    "Red",
    "Rose Gold",
    "Silver",
    "Silver White",
    "Silver white",
    "White",
    "White Mother Of Pearl",
    "Yellow",
  ];

  const functions = [
    "Analog",
    "Analog with Date",
    "Analog with Day and Date",
    "Analog Moonphase",
    "Digital",
    "Multifunction",
    "Automatic",
    "Techno Beats",
    "Smart",
    "Analog Digital",
    "Chronograph",
  ];

  const strapMaterials = [
    "Leather",
    "Metal",
    "Stainless Steel",
    "Silicone",
    "Plastic",
    "Brass",
    "Denim",
    "PU",
    "TPU",
    "Acetate",
    "Ceramic",
    "Bi Metal",
  ];

  const collections = [
    "Acetate",
    "After Dark",
    "All Nighters",
    "Arcade",
    "Athleisure",
    "Bandhan",
    "Beyond Gold",
    "Blush",
    "Blush It Up",
    "Bolt",
    "Camo",
    "Carbon Series",
    "Ceramic Fusion",
    "Classic Chrono",
    "Classic Distincta",
    "Classic Gold",
    "CLASSIQUE",
    "Classique Slim",
    "Classique Slimline",
    "CSK",
    "Denim",
    "Edge",
    "Edge Baseline",
    "Edge Ceramic",
    "Edge Fusion",
    "Edge Metal",
    "Edge Zen",
    "Elmnt",
    "Elite",
    "Essentials",
    "Fashion Acetate",
    "FastFit",
    "Fastrack Animal Print",
    "Fastrack Fit Outs",
    "Fastrack Ruffles",
    "Floral Folkart",
    "Force",
    "Fundamentals",
    "Geometrix",
    "Glitch",
    "Glitz",
    "Grandmaster",
    "Hashtag",
    "Hitlist",
    "I Love Me",
    "Karishma",
    "Karishma Radiance",
    "KARISHMA",
    "Knot",
    "Ladies Edge",
    "Ladies Karishma",
    "Linnea",
    "Love All",
    "Maritime",
    "Minimals",
    "Mission Mangal",
    "Modern Classics",
    "Multifunctions",
    "Neo",
    "Neo Black & Gold",
    "Neo Splash",
    "Neo Workdays",
    "Noir",
    "NXT",
    "Octane",
    "On Trend",
    "Onyx",
    "Opulent III",
    "Pankh",
    "Pastel Dreams",
    "Play",
    "Purple Acetate",
    "Purple Ceramics",
    "Purple Glam It Up",
    "Quartet",
    "Raga",
    "Raga Aurora",
    "Raga Chic",
    "Raga Delight",
    "Raga Facets",
    "RAGA FLORA",
    "Raga I Am",
    "Raga Moments of Joy",
    "Raga Moonlight",
    "Raga Power Pearls",
    "Raga Viva",
    "Regalia Opulent",
    "Reloaded",
    "Retro",
    "RPM",
    "SF Analog",
    "SF Hustler",
    "Shaped Cases",
    "Silver Lining",
    "Sleek",
    "Slim Multifunction",
    "Slimline",
    "Smart Plaid",
    "Sonata Pair",
    "Sparkle",
    "Splash",
    "Stellar",
    "Steel Daisies",
    "Streetwear",
    "Stunners",
    "Sunburn",
    "Techno Beats",
    "Tet",
    "TGIF",
    "Titan Bandhan",
    "Titan Premium Workwear",
    "Titan Smart",
    "Titan Smart 2",
    "Trendies",
    "Trendsetters",
    "Tripster",
    "Unveil",
    "Urban",
    "Uptown Retreat",
    "Utsav",
    "Varsity",
    "Versatyle",
    "Versatyle 2",
    "Volt",
    "Wander",
    "Wear Your Look",
    "Wedding",
    "Women of Steel",
    "Workwear",
    "Yin & Yang",
  ];

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
    console.log(selectedCategory);
    console.log(price);
    console.log(description);
    console.log(stock);
    console.log(collection);
    console.log(brand);
    console.log(gender);
    console.log(strapMaterial);
    console.log(dialColor);
    console.log(productFunction);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", selectedCategory);
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

    dispatch(createNewProduct(formData));
  };

  useEffect(() => {
    if (isProductCreated) {
      toast("Product Created Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductCreated()),
      });
      navigate("/admin/products");
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
  }, [isProductCreated, error, dispatch]);

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
              <h1 className="mb-4">New Product</h1>

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
                  onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
                  className="form-control"
                  id="category_field"
                  value={selectedCategory}
                >
                  <option value="">Select</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="form-group">
                <label htmlFor="category_field">Category</label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  id="category_field"
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Stock */}
              <div className="form-group">
                <label htmlFor="stock_field">Stock</label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                />
              </div>

              <div className="form-group">
                <label htmlFor="collection_field">Collections</label>
                <select
                  onChange={(e) => setCollection(e.target.value)}
                  className="form-control"
                  id="collection_field"
                >
                  <option value="">Select</option>
                  {collections.map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="brand_field">Brand</label>
                <select
                  onChange={(e) => setBrand(e.target.value)}
                  className="form-control"
                  id="brand_field"
                  value={brand || ""}
                >
                  <option value="">Select</option>
                  {brands.map((SingleBrand) => (
                    <option key={SingleBrand} value={SingleBrand}>
                      {SingleBrand}
                    </option>
                  ))}
                </select>

                {/* <input
                  type="text"
                  id="brand_field"
                  className="form-control"
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                /> */}
              </div>

              {/* Additional Fields */}
              {/* <div className="form-group">
                <label htmlFor="collection_field">Collection</label>
                <input
                  type="text"
                  id="collection_field"
                  className="form-control"
                  onChange={(e) => setCollection(e.target.value)}
                  value={collection}
                />
              </div> */}

              <div className="form-group">
                <label htmlFor="gender_field">Gender</label>

                <select
                  onChange={(e) => setGender(e.target.value)}
                  className="form-control"
                  id="gender_field"
                  value={gender || ""}
                >
                  <option value="">Select</option>
                  {genders.map((SingleGender) => (
                    <option key={SingleGender} value={SingleGender}>
                      {SingleGender}
                    </option>
                  ))}
                </select>

                {/* <select
                  onChange={(e) => setGender(e.target.value)}
                  className="form-control"
                  id="gender_field"
                >
                  <option value="">Select</option>
                  {genders.map((SingleGender) => (
                    <option key={SingleGender} value={gender}>
                      {SingleGender}
                    </option>
                  ))}
                </select> */}

                {/* <input
                  type="text"
                  id="gender_field"
                  className="form-control"
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                /> */}
              </div>

              <div className="form-group">
                <label htmlFor="strapMaterial_field">Strap Material</label>

                <select
                  onChange={(e) => setStrapMaterial(e.target.value)}
                  className="form-control"
                  id="strapMaterial_field"
                  value={strapMaterial || ""}
                >
                  <option value="">Select</option>
                  {strapMaterials.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>

                {/* <input
                  type="text"
                  id="strapMaterial_field"
                  className="form-control"
                  onChange={(e) => setStrapMaterial(e.target.value)}
                  value={strapMaterial}
                /> */}
              </div>

              <div className="form-group">
                <label htmlFor="dialColor_field">Dial Color</label>
                <select
                  onChange={(e) => setDialColor(e.target.value)}
                  className="form-control"
                  id="dialColor_field"
                  value={dialColor || ""}
                >
                  <option value="">Select</option>
                  {dialColors.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
                {/* <input
                  type="text"
                  id="dialColor_field"
                  className="form-control"
                  onChange={(e) => setDialColor(e.target.value)}
                  value={dialColor}
                /> */}
              </div>

              <div className="form-group">
                <label htmlFor="function_field">Function</label>
                <select
                  onChange={(e) => setProductFunction(e.target.value)}
                  className="form-control"
                  id="function_field"
                  value={productFunction || ""}
                >
                  <option value="">Select</option>
                  {functions.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
                {/* <input
                  type="text"
                  id="function_field"
                  className="form-control"
                  onChange={(e) => setProductFunction(e.target.value)}
                  value={productFunction}
                /> */}
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
                CREATE
              </button>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
