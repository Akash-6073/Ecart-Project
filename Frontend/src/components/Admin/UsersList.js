import React, {useEffect ,useState} from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@material-ui/data-grid";
import "./UsersList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { clearErrors,deleteUser, getAllUsers } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";

const UsersList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const  alert = useAlert();
    const { error, users } = useSelector((state) => state.allUsers);
    const {  user , loading:cloading} = useSelector((state) => state.user);
    
    const {
      error: deleteError,
      isDeleted,
      message,
      loading
    } = useSelector((state) => state.profile);

  //   const deleteUserHandler = (id) => {
  //   dispatch(deleteUser(id));
  // };

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteUserHandler = (id) => {
    setDeleteUserId(id);
    if(user && user._id === id)
    {
      return alert.error("You cant delete self Account")
    }
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    dispatch(deleteUser(deleteUserId));
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCanceled = () => {
    setDeleteUserId(null);
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
          alert.success(message);
          navigate("/admin/users");
          dispatch({ type: DELETE_USER_RESET });
        }
        dispatch(getAllUsers())
    },[dispatch,alert,error,deleteError,navigate,isDeleted,message]);
    
    const columns = [
        { field: "id", 
        headerName: "User ID",
         minWidth: 100, 
         sortable:false,
         flex: 1 ,
         },
        {
          field: "name",
          headerName: "Name",
          minWidth: 100,
          flex: 0.5,
         sortable:false,
         
        },
        {
          field: "email",
          headerName: "Email",
          minWidth: 100,
          flex: 1,
         sortable:false,
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 100,
            flex: 0.5,
           sortable:false,
           cellClassName: (params) => {
            return params.getValue(params.id, "role") === "admin"
              ? "greenColor"
              : "redColor";
          },
        },
        {
          field: "date",
          headerName: "Created On",
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
              "All Users List | eCart.com"
            }
        />
                <div className="productActions">

                <Link className="adminEditProduct" to={`/admin/user/${params.getValue(params.id, "id")}`}>
                  <EditIcon />
                </Link>
                <Button
                  onClick={() =>
                    deleteUserHandler(params.getValue(params.id, "id"))
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
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this user?
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
    users && users.forEach((item) => {
        rows.push({
            id: item._id,
            role: item.role,
            email: item.email,
            name: item.name,
            date: item.createdAt.substring(8, 10) + "-" + item.createdAt.substring(5, 7) + "-" + item.createdAt.substring(0, 4),

        });
        });
  return (
    <>
    {loading ? <Loader/> : <>
    <div className="dashboardAdmin">
                <Sidebar />
                <div className="allProducts">
                    <h1>ALL &nbsp; USERS</h1>
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
    </>}

      
    </>
  )
}

export default UsersList
