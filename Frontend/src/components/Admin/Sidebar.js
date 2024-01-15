import React ,{useEffect} from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import profile from '../../images/profile.png'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddIcon from "@material-ui/icons/Add";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import RateReviewIcon from "@material-ui/icons/RateReview";
import Loader from "../layout/Loader/Loader";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const {loading,user} = useSelector((state)=>state.user)
  const location = useLocation()

  return (
    <>
    {!user ? <Loader/> :
    
     <>
       <div className="sidebar">
       <p className="helloAdmin" >Hello , Admin</p>
      <Link to="/account" className="userAvatar">
        {/* <img src={user.avatar.url} alt={user.name} /> */}
        <img src={profile} alt="" />
        <div>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
      </Link>
      <Link to="/Admin/dashboard" className={location.pathname==="/Admin/dashboard"?"activeSidebar":""}>
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
    <Link to="/Admin/products" className={location.pathname==="/Admin/products"?"activeSidebar":""}>
        <p>
              <PostAddIcon /> All Products
        </p>
    </Link>
    <Link to="/Admin/product" className={location.pathname==="/Admin/product" ?"activeSidebar":""}>
        <p>
        <AddIcon /> Add Product
        </p>
    </Link>
      <Link to="/Admin/orders" className={location.pathname==="/Admin/orders"?"activeSidebar":""}>
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to="/Admin/users" className={location.pathname==="/Admin/users"?"activeSidebar":""}>
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to="/Admin/reviews" className={location.pathname==="/Admin/reviews"?"activeSidebar":""}>
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
     
     </>
    }
  
    </>
  )
}

export default Sidebar
