import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./MyOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@material-ui/icons/Launch";
import noOrder from '../../images/noOrder.png'

const MyOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { error, orders } = useSelector((state) => state.myOrders);
  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 100,
      sortable: false,
      menuIcon: false,
      menu: false,
      flex: 1,
      cellClassName: (params) => "df",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      menuIcon: false,
      cellClassName: (params) => "df",
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "date",
      headerName: "Ordered on",
      type: "date",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      menuIcon: false,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 10,
      flex: 0.5,
      sortable: false,
      menuIcon: false,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      menuIcon: false,
    },

    {
      field: "actions",
      flex: 0.4,
      headerName: "Actions",
      minWidth: 100,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link
            to={`/order/${params.getValue(params.id, "id")}`}
            style={{ transform: "scale(1)", textDecoration: "none",display:"flex",alignItems:"center" }}
          >
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];
  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        date:
          item.createdAt.substring(8, 10) +
          "-" +
          item.createdAt.substring(5, 7) +
          "-" +
          item.createdAt.substring(0, 4),
        amount: "₹" + item.totalPrice,
      });
    });
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    dispatch(myOrders());
  }, [dispatch, error, alert]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${user.name} - Orders | eCart.com`} />

          {orders && orders.length?
          <div className="myOrdersPage">
          <h1>MY ORDERS</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            pageSize={10}
            autoHeight
            alignItems="center"
            className="myOrdersTable"
          ></DataGrid>
          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
        :
        <>
         <div className="userOrders noOrders">

<img src={noOrder} alt="" />

<h2>No Orders</h2>
</div>
        </>  
      }
        </>
      )}
    </>
  );
};

export default MyOrders;
