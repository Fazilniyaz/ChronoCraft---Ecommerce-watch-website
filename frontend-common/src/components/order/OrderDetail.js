import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { orderDetail as orderDetailAction } from "../../actions/orderActions";
import Loader from "../layouts/Loader";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

export default function OrderDetail() {
  const { orderDetail, loading } = useSelector((state) => state.orderState);
  const [boolean, setBoolean] = useState(false);
  const [order, setOrder] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [boolean2, setBoolean2] = useState(false);
  const {
    shippingInfo = {},
    user = {},
    orderStatus = "Processing",
    orderItems = [],
    totalPrice = 0,
    paymentInfo = {},
  } = orderDetail;

  const userId = user._id;

  console.log(orderDetail);

  let payment_method;
  if (order?.paymentInfo?.type == "COD") {
    payment_method = "Cash On Delivery";
  } else {
    payment_method = " Online Payment";
  }
  let order_status = order.orderStatus;
  let payment_status;
  payment_method == " Cash On Delivery"
    ? (payment_status = " NOT PAID YET")
    : (payment_status = " PAID");

  if (order.orderStatus == "Cancelled" || order.orderStatus == "Returned") {
    payment_status = " PAYMENT REFUNDED ON WALLET";
  }

  // const isPaid = paymentStatus === "PAID";
  const dispatch = useDispatch();

  const { id } = useParams();
  useEffect(() => {
    dispatch(orderDetailAction(id));
    async function fetchOrderDetails() {
      try {
        const { data } = await axios.get(`/api/v1/order/${id}`);
        setOrder(data.order);
        setBoolean(true);
        console.log("Data in orders", data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
    fetchOrderDetails();
  }, [dispatch, id, boolean]);

  useEffect(() => {
    async function getAllCartItems() {
      try {
        const { data } = await axios.get(
          `/api/v1/CartProductsOfSingleUser/${userId}`
        );
        setCartItems(data.cartItems);
        setBoolean2(true);
      } catch (err) {
        toast("Error Fetching Datas", {
          type: "error",
          position: "bottom-center",
        });
      }
    }
    getAllCartItems();
  }, [boolean2]);

  const handleCancelOrder = () => {
    var cancelData = {
      type:
        order?.paymentInfo?.type === "COD"
          ? "Cash On Delivery"
          : "Online Payment",
      decision: "Cancel",
      user: userId,
      order: id,
    };
    async function CancelOrder() {
      try {
        const { data } = await axios.post(
          `/api/v1/ReturnOrCancelOrder`,
          cancelData
        );
        toast("Order Return request Submitted!", {
          type: "success",
          position: "bottom-center",
        });
      } catch (err) {
        toast(err.response.data.message, {
          type: "error",
          position: "bottom-center",
        });
      }
    }
    CancelOrder();
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set Title
    doc.setFontSize(18);
    doc.text("Order Invoice", 10, 10);

    // Add Order Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderDetail._id}`, 10, 20);
    doc.text(`Name: ${user.name}`, 10, 30);
    doc.text(`Phone: ${shippingInfo.phoneNo}`, 10, 40);
    doc.text(
      `Address: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.state}, ${shippingInfo.country}`,
      10,
      50
    );
    doc.text(`Amount Paid: $${totalPrice}`, 10, 60);
    doc.text(
      `Payment Method: ${
        paymentInfo.type == "COD" ? "Cash On Delivery" : "Online Payment"
      }`,
      10,
      70
    );

    // Add Ordered Items
    doc.text("Ordered Items:", 10, 80);
    let startY = 90;
    orderItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - $${item.price} x ${item.quantity}`,
        10,
        startY
      );
      startY += 10;
    });

    // Save PDF
    doc.save(`invoice_${orderDetail._id}.pdf`);
  };

  const handleReturnOrder = () => {
    var returnData = {
      type:
        order?.paymentInfo?.type === "COD"
          ? "Cash On Delivery"
          : "Online Payment",
      decision: "Return",
      user: userId,
      order: id,
    };
    async function ReturnOrder() {
      try {
        const { data } = await axios.post(
          `/api/v1/ReturnOrCancelOrder`,
          returnData
        );
        toast("Order Return request Submitted!", {
          type: "success",
          position: "bottom-center",
        });
      } catch (err) {
        toast(err.response.data.message, {
          type: "error",
          position: "bottom-center",
        });
      }
    }
    ReturnOrder();
  };

  console.log(order);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="container">
            <div className="row d-flex justify-content-between">
              <div className="col-12 col-lg-8 mt-5 order-details">
                <h1 className="mt-2 stock-3">Order # {orderDetail._id}</h1>

                <h4 className="mb-4 headings">Shipping Info</h4>
                <p className="mb-4">
                  <b>Name:</b> {user.name}
                </p>
                <p className="mb-4">
                  <b>Phone:</b> {shippingInfo.phoneNo}
                </p>
                <p className="mb-4">
                  <b>Address:</b>
                  {shippingInfo.address}, {shippingInfo.city},{" "}
                  {shippingInfo.postalCode}, {shippingInfo.state},{" "}
                  {shippingInfo.country}
                </p>
                <p>
                  <b className="mb-4">Amount:</b> ${totalPrice}
                </p>

                <hr className="mt-4" />

                <h4 className="my-4">
                  Payment :
                  <span
                    className={
                      payment_status == "PAID" ? "redColor" : "greenColor"
                    }
                  >
                    {/* <b>{paymentInfo.type === "COD" ? paymentStatus : "PAID"}</b> */}
                    {payment_status}
                  </span>
                </h4>
                <h4 className="my-4">
                  Payment Methods :
                  <span className={"greenColor"}>
                    {payment_method}
                    {/* <b>
                      {paymentInfo.type === "COD"
                        ? " Cash on Delivery"
                        : " Online Payments"}
                    </b> */}
                  </span>
                </h4>

                <h4 className="my-4">
                  Order Status:
                  <span
                    className={
                      orderStatus && orderStatus.includes("Delivered")
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {/* <b>{"  " + orderStatus}</b> */}
                    <b>{" " + order_status}</b>
                  </span>
                </h4>

                <h4 className="my-4 headings">Ordered Items:</h4>

                <hr />
                <div className="cart-item my-1">
                  {orderItems &&
                    orderItems.map((item, index) => (
                      <div className="row my-5" key={index}>
                        <div className="col-4 col-lg-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid"
                          />
                        </div>

                        <div className="col-5 col-lg-5">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                          <p>${item.price}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                          <p>{item.quantity} Piece(s)</p>
                        </div>
                      </div>
                    ))}
                </div>
                <hr />

                {/* Button Section */}
                <div className="d-flex justify-content-center mt-4">
                  {orderStatus.includes("Delivered") ? (
                    <button
                      className="btn btn-primary mx-2"
                      onClick={handleReturnOrder}
                    >
                      Return Order
                    </button>
                  ) : (
                    ""
                  )}
                  {orderStatus.includes("Shipped") ||
                  orderStatus.includes("Processing") ? (
                    <button
                      className="btn btn-primary mx-2"
                      onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </button>
                  ) : (
                    ""
                  )}

                  {orderStatus.includes("Returned") ||
                  orderStatus.includes("Cancelled") ? (
                    <span className="stock">
                      Order{" "}
                      {orderStatus.includes("Returned")
                        ? "Returned"
                        : "Cancelled"}{" "}
                      Successfully!...
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {orderStatus.includes("Delivered") && (
                    <button
                      className="btn btn-primary mx-2"
                      onClick={generatePDF}
                    >
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
