import React, { useEffect,useState } from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteOrder,
    getAllOrders,
    clearErrors,
  } from "../../actions/orderAction";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { Typography } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import noOrder from '../../images/noOrder.png'
import './OrderList.css'
import Loader from "../layout/Loader/Loader";
const OrderList = () => {
    const navigate = useNavigate();
    const  alert = useAlert();
    const { error, orders , loading } = useSelector((state) => state.allOrders);
    const { error: deleteError, isDeleted } = useSelector((state) => state.order);

    const dispatch = useDispatch();
    // const deleteOrderHandler = (id) => {
    //     dispatch(deleteOrder(id));
    //   };
    const [deleteOrderId, setDeleteOrderId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
    const deleteOrderHandler = (id) => {
      setDeleteOrderId(id);
      setIsDeleteDialogOpen(true);
    };
  
    const handleDeleteConfirmed = () => {
      dispatch(deleteOrder(deleteOrderId));
      setIsDeleteDialogOpen(false);
    };
  
    const handleDeleteCanceled = () => {
      setDeleteOrderId(null);
      setIsDeleteDialogOpen(false);
    };
      useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
        }
    
        if (deleteError) {
          alert.error(deleteError);
          dispatch(clearErrors());
        }
    
        if (isDeleted) {
          alert.success("Order Deleted Successfully");
          navigate("/Admin/dashboard");
          dispatch({ type: DELETE_ORDER_RESET });
        }
    
        dispatch(getAllOrders());
      }, [dispatch, alert, error, deleteError, navigate, isDeleted]);
    
    const columns = [
        { field: "id", 
        headerName: "Order ID",
         minWidth: 100, 
         sortable:false,
         flex: 0.8 ,
         },
        {
          field: "status",
          headerName: "Status",
          minWidth: 100,
          flex: 0.5,
         sortable:false,
         cellClassName: (params) => {
            return params.getValue(params.id, "status") === "Delivered"
              ? "greenColor"
              : "redColor";
          },
         
        },
        {
            field: "itemsQty",
            headerName: "Quantity",
            type: "number",
            minWidth: 100,
            flex: 0.5,
           sortable:false,
  
  
          },
        {
          field: "amount",
          headerName: "Amount",
          type: "number",
          minWidth: 10,
          flex: 0.5,
         sortable:false,
        },
        {
          field: "date",
          headerName: "Ordered On",
          type: "number",
          minWidth: 10,
          flex: 0.5,
         sortable:false,
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
              <>
               <MetaData
            title={
              "All Orders List | eCart.com"
            }
        />
                <div className="productActions">

                <Link className="adminEditProduct" to={`/Admin/order/${params.getValue(params.id, "id")}`}>
                  <EditIcon />
                </Link>
                <Button
                  onClick={() =>
                    deleteOrderHandler(params.getValue(params.id, "id"))
                  }
                >
                  <DeleteIcon />
                </Button>
                <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCanceled}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Delete Order"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p style={{color:"red" , fontSize:"12px"}}>(If you delete this , the orders Amount will be deducted from Total Sales Amount)</p>
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCanceled} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
                </div>
              </>
            );
          },
        },
      ];
    const rows = [];
 orders && orders.forEach((item) => {
        rows.push({
            id: item._id,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice,
            status: item.orderStatus,
            date: item.createdAt.substring(8, 10) + "-" + item.createdAt.substring(5, 7) + "-" + item.createdAt.substring(0, 4),

        });
        });
  return (
    <>
{loading ? <Loader/>:

<>
{ orders.length!==0 ? <>
  <div className="dashboardAdmin">
                <Sidebar />
                <div className="allProducts">
                    <h1>ALL&nbsp; ORDERS</h1>
                    <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="productListTable myOrdersTable"
                    autoHeight
                    ></DataGrid>
                </div>
    </div>
 </> :
   <>
  <div className="dashboardAdmin">
  <Sidebar />
  <div className="allProducts noOrders">

      <img src={noOrder} alt="" />

      <h2>No Orders</h2>
    </div>
  </div>
   </>}

</>
}

      
    </>
  )
}

export default OrderList
