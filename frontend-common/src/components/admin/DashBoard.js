// import Sidebar from "./SideBar";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { getAdminProducts } from "../../actions/productActions";
// import { Link } from "react-router-dom";

// export default function Dashboard() {
//   const { products } = useSelector((state) => state.productsState);
//   const dispatch = useDispatch();
//   const { users = [] } = useSelector((state) => state.userState);
//   let outOfStock = 0;

//   if (products && products.length > 0) {
//     products.forEach((product) => {
//       if (product.stock === 0) {
//         outOfStock = outOfStock + 1;
//       }
//     });
//   }

//   useEffect(() => {
//     dispatch(getAdminProducts);
//   }, []);

//   return (
//     <div className="row">
//       <div className="col-12 col-md-2">
//         <Sidebar />
//       </div>
//       <div className="col-12 col-md-10">
//         <div className="container container-fluid">
//           <div className="row">
//             {/* <div className="col-12 col-md-2">
//               <h4>Sidebar</h4>
//             </div> */}

//             <div className="col-12 col-md-10">
//               <h1 className="my-4">Dashboard</h1>
//               <div className="row pr-4">
//                 <div className="col-xl-12 col-sm-12 mb-3">
//                   <div className="card text-white bg-primary o-hidden h-100">
//                     <div className="card-body">
//                       <div className="text-center card-font-size">
//                         Total Amount
//                         <br /> <b>$3425</b>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row pr-4">
//                 <div className="col-xl-3 col-sm-6 mb-3">
//                   <div className="card text-white bg-success o-hidden h-100">
//                     <div className="card-body">
//                       <div className="text-center card-font-size">
//                         Products
//                         <br /> <b>{products && products.length}</b>
//                       </div>
//                     </div>
//                     <a
//                       className="card-footer text-white clearfix small z-1"
//                       to="/admin/products"
//                     >
//                       <span className="float-left">View Details</span>
//                       <span className="float-right">
//                         <i className="fa fa-angle-right"></i>
//                       </span>
//                     </a>
//                   </div>
//                 </div>

//                 <div className="col-xl-3 col-sm-6 mb-3">
//                   <div className="card text-white bg-danger o-hidden h-100">
//                     <div className="card-body">
//                       <div className="text-center card-font-size">
//                         Orders
//                         <br /> <b>345</b>
//                       </div>
//                     </div>
//                     <a
//                       className="card-footer text-white clearfix small z-1"
//                       to="/admin/orders"
//                     >
//                       <span className="float-left">View Details</span>
//                       <span className="float-right">
//                         <i className="fa fa-angle-right"></i>
//                       </span>
//                     </a>
//                   </div>
//                 </div>

//                 <div className="col-xl-3 col-sm-6 mb-3">
//                   <div className="card text-white bg-info o-hidden h-100">
//                     <div className="card-body">
//                       <div className="text-center card-font-size">
//                         <Link to="/admin/users">Users</Link>
//                         <br /> <b>{users.length}</b>
//                       </div>
//                     </div>
//                     <Link
//                       className="card-footer text-white clearfix small z-1"
//                       href="/admin/users"
//                     >
//                       <span className="float-left">View Details</span>
//                       <span className="float-right">
//                         <i className="fa fa-angle-right"></i>
//                       </span>
//                     </Link>
//                   </div>
//                 </div>

//                 <div className="col-xl-3 col-sm-6 mb-3">
//                   <div className="card text-white bg-warning o-hidden h-100">
//                     <div className="card-body">
//                       <div className="text-center card-font-size">
//                         Out of Stock
//                         <br /> <b>{outOfStock}</b>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";
import { getAdminProducts } from "../../actions/productActions";
import axios from "axios";
import Loader from "../layouts/Loader";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { products = [] } = useSelector((state) => state.productsState);
  const dispatch = useDispatch();
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [boolean, setBoolean] = useState(false);

  let outOfStock = 0;

  if (products.length > 0) {
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock = outOfStock + 1;
      }
    });
  }

  useEffect(() => {
    dispatch(getAdminProducts);
  }, []);

  useEffect(() => {
    async function getOrdersCount() {
      const { data } = await axios.get(`/api/v1/admin/getAllOrdersCount`);
      console.log(data);
      setOrdersCount(data.orderCount);
      setBoolean(true);
    }
    getOrdersCount();

    async function getUsersCount() {
      const { data } = await axios.get(`/api/v1/admin/GetCountOfUsers`);
      console.log(data);
      setUsersCount(data.userCount);
      setBoolean(true);
    }
    getUsersCount();

    async function getTotalSales() {
      const { data } = await axios.get(
        `/api/v1/admin/salesReport?filterBy=yearly`
      );
      console.log(data);
      setTotalSales(data.totalAmount);
      setBoolean(true);
    }
    getTotalSales();
  }, [boolean]);

  return boolean ? (
    <div className="container-fluid">
      {" "}
      {/* Full-width container */}
      <div className="row">
        <div className="col-12 col-md-2 px-0">
          {" "}
          {/* Remove padding */}
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <h1 className="my-4 headings">Dashboard</h1>

          <div className="row pr-4">
            <div className="col-xl-12 col-sm-12 mb-3">
              <div className="card text-white bg-primary o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Total Amount
                    <br />{" "}
                    <Link to="/admin/salesReport">
                      <b>${totalSales}</b>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row pr-4">
            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-success o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Products
                    <br /> <b>{products.length}</b>
                  </div>
                </div>
                <a
                  className="card-footer text-white clearfix small z-1"
                  to="/admin/products"
                >
                  <span className="float-left">View Details</span>
                  <span className="float-right">
                    <i className="fa fa-angle-right"></i>
                  </span>
                </a>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-danger o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Orders
                    <br /> <b>{ordersCount}</b>
                  </div>
                </div>
                <a
                  className="card-footer text-white clearfix small z-1"
                  to="/admin/orders"
                >
                  <span className="float-left">View Details</span>
                  <span className="float-right">
                    <i className="fa fa-angle-right"></i>
                  </span>
                </a>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-info o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Users
                    <br /> <b>{usersCount}</b>
                  </div>
                </div>
                <a
                  className="card-footer text-white clearfix small z-1"
                  href="/admin/users"
                >
                  <span className="float-left">View Details</span>
                  <span className="float-right">
                    <i className="fa fa-angle-right"></i>
                  </span>
                </a>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-warning o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Out of Stock
                    <br /> <b>{outOfStock}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}
