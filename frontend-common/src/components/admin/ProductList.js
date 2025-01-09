import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// import { clearError } from "../../slices/productSlice";
import { Button } from "react-bootstrap";
import { Fragment } from "react";
import Loader from "../../components/layouts/Loader";
import { MDBDataTable } from "mdbreact";
import Sidebar from "./SideBar";
import {
  deleteProduct,
  disableProduct,
  enableProduct,
  getAdminProducts,
} from "../../actions/productActions";
import { clearProductDeleted } from "../../slices/productSlice";
import { clearError } from "../../slices/productsSlice";

export default function ProductList() {
  const {
    products = [],
    loading = true,
    error,
  } = useSelector((state) => state.productsState);
  const { isProductDeleted, error: productError } = useSelector(
    (state) => state.productState
  );
  console.log(isProductDeleted);
  const dispatch = useDispatch();
  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary"
              style={{ margin: "10px" }}
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, product._id)}
              className="btn btn-danger py-1 px-2 ml-2"
              style={{ margin: "10px" }}
            >
              <i className="fa fa-trash"></i>
            </Button>
            {product.disabled ? (
              <Button
                onClick={(e) => enableHandler(e, product._id)}
                className="btn btn-success py-1 px-2 ml-2"
                style={{ margin: "10px auto" }}
              >
                Enable
              </Button>
            ) : (
              <Button
                onClick={(e) => disableHandler(e, product._id)}
                className="btn btn-warning py-1 px-2 ml-2"
                style={{ margin: "10px" }}
              >
                Disable
              </Button>
            )}
          </Fragment>
        ),
      });
    });

    return data;
  };

  const enableHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(enableProduct(id));
  };

  const disableHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(disableProduct(id));
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    if (isProductDeleted) {
      toast("Product Deleted Succesfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductDeleted()),
      });
      return;
    }

    dispatch(getAdminProducts);
  }, [dispatch, error, isProductDeleted]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 class="my-4 headings">Product List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setProducts()}
              bordered
              striped
              hover
              className="px-6"
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}
