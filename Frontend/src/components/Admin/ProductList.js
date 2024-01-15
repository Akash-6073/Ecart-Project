import React, { useEffect,useState } from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAdminProduct ,deleteProduct } from "../../actions/productActions";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import Loader from "../layout/Loader/Loader";

const ProductList = () => {
    const {error,products} = useSelector((state)=>state.products)
    const navigate = useNavigate();
    const  alert = useAlert();
    const { error: deleteError, isDeleted,loading } = useSelector(
      (state) => state.product
    );
    const dispatch = useDispatch();
    // const deleteProductHandler = (id) => {
    //   dispatch(deleteProduct(id));
    // };
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
    const deleteProductHandler = (id) => {
      setDeleteProductId(id);
      setIsDeleteDialogOpen(true);
    };
  
    const handleDeleteConfirmed = () => {
      dispatch(deleteProduct(deleteProductId));
      setIsDeleteDialogOpen(false);
    };
  
    const handleDeleteCanceled = () => {
      setDeleteProductId(null);
      setIsDeleteDialogOpen(false);
    };
  
    useEffect(()=>{
        if(error)
        {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
          alert.error(deleteError);
          dispatch(clearErrors());
        }
        if (isDeleted) {
          alert.success("Product Deleted Successfully");
          navigate("/admin/dashboard");
          dispatch({ type: DELETE_PRODUCT_RESET });
        }
        dispatch(getAdminProduct())
    },[dispatch,alert,error,deleteError,navigate,isDeleted]);
    
    const columns = [
        { field: "id", 
        headerName: "Product ID",
         minWidth: 100, 
         sortable:false,
         flex: 1 ,
         },
        {
          field: "name",
          headerName: "Name",
          minWidth: 200,
          flex: 1,
         sortable:false,
         
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 100,
            flex: 0.5,
           sortable:false,
           renderCell: (params) => {
            const stockValue = params.getValue(params.id, "stock");
            const stockStyle = {
              color: stockValue === 0 ? 'red' : 'inherit',
            };
    
            return (
              <div style={stockStyle}>
                {stockValue}
              </div>
            );
          },
  
  
          },
        {
          field: "price",
          headerName: "Price",
          type: "number",
          minWidth: 10,
          flex: 0.5,
         sortable:false,
        },
        {
          field: "date",
          headerName: "Added On",
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
              "All Products List | eCart.com"
            }
          />
                <div className="productActions">

                <Link className="adminEditProduct" to={`/admin/product/${params.getValue(params.id, "id")}`}>
                  <EditIcon />
                </Link>
                <Button
                  onClick={() =>
                    deleteProductHandler(params.getValue(params.id, "id"))
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
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <DialogTitle id="alert-dialog-title">{"Delete Product"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this product?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCanceled} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => handleDeleteConfirmed(params.getValue(params.id, "id"))} color="primary" autoFocus>
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
 products && products.forEach((item) => {
        rows.push({
            id: item._id,
            stock: item.Stock,
            name: item.name,
            price: "₹"+item.price,
            date: item.createdAt.substring(8, 10) + "-" + item.createdAt.substring(5, 7) + "-" + item.createdAt.substring(0, 4),

        });
        });
  return (
    <>
    {loading ? <Loader/>:
    <>
      <div className="dashboardAdmin">
                <Sidebar />
                <div className="allProducts">
                    <h1>ALL &nbsp;PRODUCTS</h1>
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
    </>
    }

      
    </>
  )
}

export default ProductList
