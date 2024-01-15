import React,{useEffect, useRef, useState} from 'react'
import './LoginSignup.css'
import Loader from '../layout/Loader/Loader'
import { Link } from 'react-router-dom'
import profile from '../../images/profile.png'
import cart from '../../images/cart.png'
import {useDispatch,useSelector } from 'react-redux'
import {login,clearErrors,register} from '../../actions/userAction'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate,useLocation } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { useAlert } from 'react-alert';

const LoginSignup = () => {
  const alert = useAlert();
const location=useLocation();
    const navigate = useNavigate();
    // getting data from userAction
    const dispatch = useDispatch();
    const{error,isAuthenticated,loading} = useSelector((state)=>state.user)
    
    useEffect(()=>{
        if(error!=="Please Login to access the resource")
        {
            toast.error(error, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
                dispatch(clearErrors())
        }
    },[dispatch,error])
    const redirect=location.search ? location.search.split("=")[1] : "/account"
    if(isAuthenticated)
        {
        // alert.success("Login Successfully");
                navigate(redirect);
    }

    // LOGIN
    const loginTab = useRef(null) ;
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const loginSubmit = (e)=>{
        e.preventDefault();
         dispatch(login(loginEmail,loginPassword))  // this will dispatch to login action on submit
    }
    const [loginPassword, setLoginPassword] = useState("")
    const [loginEmail, setLoginEmail] = useState("")

    const [msg, setMsg] = useState("Login Here")
    const [para, setPara] = useState("Get Access to order");
    const switchTabs = (e,tab)=>{
        if(tab === "login")
        {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");
            
            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
              setMsg("Login here")
              setPara("Get Access to order")

        }
        if(tab === "register")
        {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");
            
            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
            setMsg("Signup here")
            setPara("Signup to Access your orders")

        }
    }
    // REGISTER

    const [user, setUser] = useState({
        name:"",
        email:"",
        password:""
    })
    const {name ,email , password} =user;

    const [avatar, setAvatar] = useState()
    const [avatarPreview,setAvatarPreview] = useState(profile)
    const registerSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name",name)
        myForm.set("email",email)
        myForm.set("password",password)
        myForm.set("avatar",avatar)
        dispatch(register(myForm))  // this will dispatch to register action on submit
    };

    const registerDataChange =(e)=>{
        if(e.target.name === "avatar"){
            const reader = new FileReader();
            reader.onload = ()=>{
                if(reader.readyState === 2)
                {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result)
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        else{
             setUser({...user,[e.target.name]: e.target.value});
        }
    }

  return (
    <>
    {loading ? <Loader/>:
    <>
          <div className="loginSignup">
        {/* <h1 style={{paddingBottom:"15px"}}>get Signed in Now</h1> */}
        <div className='loginDesign'>
            <div className="loginBox">
                <div>
                <h1>{msg}</h1>
                <p>{para}</p>

                </div>
                <img src={cart} alt="" />
            </div>
            <div className="loginSignupBox">
                <div>
                    <div className="loginSignupToggle">
                        <p onClick={(e)=>switchTabs(e,"login")}>LOGIN</p>
                        <p onClick={(e)=>switchTabs(e,"register")}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form className='loginForm' ref={loginTab} onSubmit={loginSubmit} action="">
                    <div className="loginEmail">
                    <i className="fa-solid fa-envelope"></i>
                        <input type="email"
                            placeholder='Email'                    
                            required
                            value={loginEmail}
                            onChange={(e)=>setLoginEmail(e.target.value)}
                        />
                    </div>
                    <div className="loginPassword">
                    <i className="fa-solid fa-lock"></i>
                        <input type="password"
                            placeholder='Password'
                            required
                            value={loginPassword}
                            onChange={(e)=>setLoginPassword(e.target.value)}
                        />
                    </div>
                    <Link to="/password/forgot">Forgot Password ?</Link>
                    <input type="submit" value='Login' className='loginBtn' />
                </form>
                
                {/* REGISTER */}
                <form action="" className='signupForm' ref={registerTab} encType='multipart/form-data' onSubmit={registerSubmit}>
                    <div className="signUpName">
                    <i className="fa-solid fa-user"></i>
                        <input type="text"
                            placeholder='Name'                    
                            required
                            value={name}
                            name='name'
                            onChange={registerDataChange}
                        />
                    </div>
                    <div className="signUpEmail">
                    <i className="fa-solid fa-envelope"></i>
                        <input type="email"
                            placeholder='Email'                    
                            required
                            value={email}
                            name='email'
                            onChange={registerDataChange}
                        />
                    </div>
                    <div className="signUpPassword">
                    <i className="fa-solid fa-lock"></i>
                        <input type="password"
                            placeholder='Password'                    
                            required
                            value={password}
                            name='password'
                            onChange={registerDataChange}
                        />
                    </div>
                    <div id='registerImage'>
                    <img src={avatarPreview} alt="Avatar Preview" />
                        <input type="file"
                            name='avatar'
                            accept='image/*'
                            onChange={registerDataChange}
                        />
                    </div>
                    <input type="submit" value='Register' className='signUpBtn'  />


                </form>
            </div>
        </div>
      </div>
    </>
    }
    <ToastContainer
                      position="bottom-center"
                      autoClose={2000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                      />
    </>
  )
}

export default LoginSignup
