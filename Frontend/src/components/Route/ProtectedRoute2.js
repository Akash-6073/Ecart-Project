import React from 'react'
import { Navigate} from "react-router-dom";


const ProtectedRoute2 = ({ isAuthenticated,user,children}) => {
    if(!isAuthenticated){
        return <Navigate to='/login'/>;
    }
  return children;
}

export default ProtectedRoute2
