import React ,{useState} from 'react'
import './UserOptions.css'
import profile from '../../../images/profile.png'
import {SpeedDial,SpeedDialAction} from '@material-ui/lab'
import Backdrop from "@material-ui/core/Backdrop";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../actions/userAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlert } from 'react-alert';
const UserOptions = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const{user,isAuthenticated} = useSelector((state)=>state.user)

  const options = [
    {icon:<ListAltIcon/> , name:"Orders" , func:orders},
    {icon :<PersonIcon/>, name:"Profile" , func:account},
    {icon: <ExitToAppIcon/>, name:"Logout", func:logoutUser},
  ];

  // if role is admin then it will add to to the options
  if(user.role==="admin")
  {
    options.unshift({
    icon: <SupervisorAccountIcon/>, name:"Admin Panel", func:dashboard  

    })
  }
  
  function dashboard(){
    navigate('/Admin/dashboard');
  }

  function orders(){
    navigate('/order');
  }

  function account(){
    navigate('/account')
  }
  function logoutUser(){
      
      dispatch(logout());
      if(isAuthenticated)
      {

        alert.success("Logout Successfully");
     
      }
  }

  const [open, setOpen] = useState(false)
  return (
    <>
    <Backdrop open={open} style={{zIndex:"10"}}/>
      <SpeedDial 
      ariaLabel='="SpeedDial tooltip example'
      onClose={()=>setOpen(false)}
      onOpen={()=>setOpen(true)}
      open = {open}
      direction='down'
      className='speedDial'
      icon={
        <img
         className='speedDialIcon'
         src={user.avatar.url ? user.avatar.url:profile}
         alt='Profile'
         />
      }
      >
       {options.map((item)=>(
         <SpeedDialAction 
         key={item.name}
         icon={item.icon}
         tooltipTitle={item.name} 
         tooltipOpen={window.innerWidth<=600}
         onClick={item.func}/>
       ))}
        
      </SpeedDial>
      <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
          />
    </>
  )
}

export default UserOptions
