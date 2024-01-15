import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./OrderSuccess.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";

const OrderSuccess = () => {
    const {user,loading} = useSelector((state)=>state.user)
  return (
   <>
   {loading ? <Loader/>:
   <>
    <div className="orderSuccess">
      <CheckCircleIcon />

      <Typography>{user.name} , Your Order has been Placed successfully </Typography>
      <Link to="/order">View Orders</Link>
    </div>
   </>
   }
   </>   
  )
}

export default OrderSuccess
