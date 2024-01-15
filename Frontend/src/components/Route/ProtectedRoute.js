import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate} from "react-router-dom";


const ProtectedRoute = ({ isAdmin, loading,isAuthenticated,children}) => {
  const {user} =useSelector((state)=>state.user)
    if(isAuthenticated===false && loading===false){
        return <Navigate to='/login'/>;
    }
    if(isAdmin===true && loading===false && user.role !=="admin")
    {
      return <Navigate to='/login'/>;
    }
  return children;
}

export default ProtectedRoute
