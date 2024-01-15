import React, { useState,useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import MetaData from "../MetaData";
import { useDispatch, useSelector } from "react-redux";
import UserOptions from "../Header/UserOptions";
import Loader from "../Loader/Loader";
import { logout } from "../../../actions/userAction";
import { useAlert } from "react-alert";
const Navbar = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const dispatch = useDispatch();
  const [keyWord, setKeyword] = useState("");
  const navigate = useNavigate();
  const alert = useAlert();
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    console.log(keyWord);
    if (keyWord.trim()) {
      navigate(`/products/${keyWord}`);
    } else {
      navigate("/products");
    }
  };
  const logoutUser=()=>{
    
    dispatch(logout());
    if(isAuthenticated)
    {

      alert.success("Logout Successfully");
   
    }
}

// var navW="0",clos="0";
// const closeNav = () => {
//   let navWd = document.querySelector('.ul')
//   navWd.style.width = "0 !important";
//   navW="0";
//   console.log("CloseNav "+navW)

// };
// const openNav = ()=>{
//   let navWd = document.querySelector('.ul')
//   if(navW==="0")
//   {
//     navWd.style.width = "80% !important";
//     navW="80%"
//   }
//   else if(navW==="80%")
//   {
//     navWd.style.width = "0 !important";
//     navW="0"
//   }
//   console.log("OpenNav "+navW)
// }


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {keyWord && <MetaData title={"Serached here"} />}
          <nav className={`responsiveNav`}>
                <input type="checkbox" id="check" />
            <div className="responsiveNavLeft ">
              <div className="navBackdrop"  >
                <label htmlFor="check" className="checkbtn">
                  <i className="fas fa-bars"> </i>
                </label>
              </div>
                <Link
                  to="/"
                  className="logo"
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  {" "}
                  <label className="logo" style={{ cursor: "pointer" }}>
                    <i className="fa-solid fa-store"></i>  Ecart
                  </label>
                </Link>
            </div>
            <div className="responsiveNavRight">
                  <li className="navSearch doubleNavResponsive">
                      <form
                        action=""
                        className="searchBox"
                        onSubmit={searchSubmitHandler}
                      >
                        <input
                          type="text"
                          placeholder="Search a product"
                          onKeyUp={searchSubmitHandler}
                          onChange={(e) => setKeyword(e.target.value)}
                        />

                        <i
                          onClick={searchSubmitHandler}
                          className="fa-solid fa-magnifying-glass"
                        ></i>
                      </form>
                    </li>
                  <li className="cart-icon">
                      <Link to="/cart" style={{ textDecoration: "none" }}>
                        <i className="fa-solid fa-cart-shopping"></i>{" "}
                        <sup
                          className="cart-item-count"
                          style={{
                            backgroundColor: "orange",
                            visibility: cartItems.length === 0 ? "hidden" : "visible",
                          }}
                        >
                          {cartItems.length > 0 ? cartItems.length : "0"}
                        </sup>
                      </Link>
                    </li>
                  {isAuthenticated ? (
                      <li>
                        <UserOptions />
                        <span className="userOptionHide" style={{ visibility: "hidden" }}>hidden</span>
                      </li>
                    ) : (
                      <li className="navLogin">
                        <Link to="/login">
                          <i className="fa-solid fa-user"></i>
                        </Link>
                      </li>
                    )}
            </div>
            <ul className="ul">
              <div>
              <li   className="navSearch rdn">
                <form
                  action=""
                  className="searchBox"
                  onSubmit={searchSubmitHandler}
                >
                  <input
                    type="text"
                    placeholder="Search a product"
                    onKeyUp={searchSubmitHandler}
                    onChange={(e) => setKeyword(e.target.value)}
                  />

                  <i
                    onClick={searchSubmitHandler}
                    className="fa-solid fa-magnifying-glass"
                  ></i>
                </form>
              </li>
              <li>
                <Link to="/"  className={location.pathname==='/' ? "underLineNav":""} >
                  <i className="fa-solid fa-house"></i> Home
                </Link>
              </li>
              <li>
                <Link to="/products" className={location.pathname==='/products' ? "underLineNav":""}>
                  <i className="fa-solid fa-bag-shopping"></i> Products
                </Link>
              </li>
              <li>
                <Link to="/contactUs" className={location.pathname==='/contactUs' ? "underLineNav":""}><i className="fa-solid fa-phone"></i> Contact Us</Link>
              </li>
              <li className="cart-icon rdn">
                <Link to="/cart" style={{ textDecoration: "none" }}>
                  <i className="fa-solid fa-cart-shopping"></i>{" "}
                  <sup
                    className="cart-item-count"
                    style={{
                      backgroundColor: "orange",
                      visibility: cartItems.length === 0 ? "hidden" : "visible",
                    }}
                  >
                    {cartItems.length > 0 ? cartItems.length : "0"}
                  </sup>
                </Link>
              </li>
              
              <li className="responiveVisible">
                <Link to='/cart'><i className="fa-solid fa-cart-shopping"></i> Cart  <sup
                          className="cart-item-count"
                          style={{
                            backgroundColor: "orange",
                            visibility: cartItems.length === 0 ? "hidden" : "visible",
                          }}
                        >
                          {cartItems.length > 0 ? cartItems.length : "0"}
                        </sup></Link>
              </li>

              {isAuthenticated ? (
                <li className="rdn">
                  <UserOptions />
                  <span style={{ visibility: "hidden" }}>hidden</span>
                </li>
              ) : (
                <li className="rdn">
                  <Link to="/login" className="nln">
                    <i className="fa-solid fa-user"></i> &nbsp;Login
                  </Link>
                </li>
              )}
              
              </div>
             {isAuthenticated?
              <li className="responiveVisible responviveLogout">
              <Link to="/" onClick={logoutUser}>Log Out <i className="fa-solid fa-power-off"></i></Link>
            </li>:<li className="responiveVisible responviveLogout">
              <Link style={{fontFamily:'var(--font1)'}} to="/login" >Log in <i className="fa-solid fa-arrow-right-to-bracket"></i></Link>
            </li>
             }
            </ul>
          </nav>
          <div className="searchNav">

            <li className="navSearch responnavSearch">
                      <form
                        action=""
                        className="searchBox"
                        onSubmit={searchSubmitHandler}
                      >
                        <input
                          type="text"
                          placeholder="Search a product"
                          onKeyUp={searchSubmitHandler}
                          onChange={(e) => setKeyword(e.target.value)}
                        />

                        <i
                          onClick={searchSubmitHandler}
                          className="fa-solid fa-magnifying-glass"
                        ></i>
                      </form>
              </li>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
