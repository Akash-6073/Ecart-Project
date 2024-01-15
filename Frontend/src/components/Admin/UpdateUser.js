import React, {useEffect, useState } from "react";
import "./UpdateUser.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import {
    getUserDetails,
    updateUser,
    clearErrors,
  } from "../../actions/userAction";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import Loader from "../layout/Loader/Loader";

const UpdateUser = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const{id} = useParams();
    const {user:cuser , loading:cloading } = useSelector((state)=>state.user);
    const { loading, error, user } = useSelector((state) => state.userDetails);
    const { loading: updateLoading, error: updateError, isUpdated} = useSelector((state) => state.profile);

    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

    
      useEffect(() => {
        if(user.role==="user")
        {
          return navigate('/account');
        }
        if (user && user._id !== id) {
            dispatch(getUserDetails(id));
          } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
          }
          if (error) {
            alert.error(error);
            dispatch(clearErrors());
          }
      
          if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
          }
      
          if (isUpdated) {
            alert.success("User Updated Successfully");
            navigate("/admin/users");
            dispatch({ type: UPDATE_USER_RESET });
          }
      }, [dispatch, alert, error, navigate, isUpdated,updateError,user,id]);

    

      const updateUserSubmitHandler = (e) => {
        e.preventDefault();
    
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);
    
        dispatch(updateUser(id, myForm));
      };

       
    
  return (
    <>
     {loading && cloading ? <Loader/>:
     <>
      <div className="dashboardAdmin">
                <Sidebar />
                <div className="updateProductContainer">
                <form
            className="createProductForm updateProductForm updateUserForm"
            encType="multipart/form-data"
            onSubmit={updateUserSubmitHandler}
          >
            <h1 style={{fontWeight:"lighter"}}>UPDATE &nbsp; USER</h1>

            <div>
              <PersonIcon />
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <MailOutlineIcon />
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>


            <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            <Button
              id="createProductBtn"
              type="submit"
              disabled={
               ( cuser && cuser.email===user.email ) || updateLoading ? true : false || role === "" ? true : false
              }
            >
              Update
            </Button>
          </form>
                </div>
      </div>
     </>
     }
    </>
  )
}

export default UpdateUser
