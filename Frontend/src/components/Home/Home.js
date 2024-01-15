import React, { useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PublicIcon from "@material-ui/icons/Public";
import PersonIcon from "@material-ui/icons/Person";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import { useNavigate } from "react-router-dom";
import airpods from "../../images/airpods.png";
import onePlus from "../../images/onePlus.png";
import hpPavilion from '../../images/hpPavilion.jpg'
import apple from '../../images/apple.webp'
import fireBolt from '../../images/fireBolt.avif'
import laptops from '../../images/laptops.png'
import cameras from '../../images/camera2.jpg'
import fashion from '../../images/fashion.png'
import footWear from '../../images/shoes.jfif'
import allAirpods from '../../images/allAirpods.webp'
import smartPhones from '../../images/smartPhone.png'
import smartWatches from '../../images/smartWatches.png'
import { Link } from "react-router-dom";

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  const gotThere = (cat) => {
    navigate(`/products`);
    dispatch(getProduct("", 1, [0, 150000], cat, 0));
  };
  return (
    <div className="nopen">
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData
            title={
              "Online Shopping Site for Electronics , Mobiles , Grocery ... | eCart.com"
            }
          />
          <div className="banner">
            {/* <p>Welocme to Ecommerce</p>
            <h1>Find Amazing Products below</h1>
            <a href="#container">
                <button className='btn btn1'>
                    Scroll <i className="fa-solid fa-computer-mouse fa-fade"></i>
                </button>
            </a>
            <button onClick={()=>gotThere("laptop")}>Click me</button> */}
           
            <div className="cats">
              <h1 className="homeHeading" >Main Categories</h1>
              <div className="catsgory">
              <div>
                <img src={laptops} alt="" />
                <p>Laptops</p>
              </div>
              <div>
                <img src={cameras} alt="" />
                <p>Cameras</p>
              </div>
              <div>
                <img src={fashion} alt="" />
                <p>Fashion</p>
              </div>
              <div>
                <img src={footWear} alt="" />
                <p>Foot Wear</p>
              </div>
              <div>
                <img src={apple} alt="" />
                <p>Airpods</p>
              </div>
              <div>
                <img src={smartPhones} alt="" />
                <p>Mobiles</p>
              </div>
              <div>
                <img src={smartWatches} alt="" />
                <p>Watches</p>
              </div>
             
              </div>
            </div>
            <div className="slides">
              <img src={airpods} alt="" />
              <div>
                <h1>AIRPODS  PRO 2</h1>
                <p><i className="fa-solid fa-circle-info"></i> Sponsored</p>
                <p>Custom high-excursion Apple driver.</p>
                <p>Custom high dynamic range amplifier.</p>
                <p>Active Noise Cancellation.</p>
                <p>Adaptive Transparency</p>
                <p> <span style={{textDecoration:"line-through"}}>₹ 26,900 </span> &nbsp;₹ 21,990 </p>

              </div>
            </div>
            
          </div>
          <div id="container">
            <h2 className="homeHeading">Featured Products</h2>
            <div className="container">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          </div>
          <div className="Suggested">
              <h1 className="homeHeading">Suggested  for   you</h1>
              <div className="suggestedForyou">
                <Link to='product/659b8e75ac300def84f35c9b'>
                    <img src={hpPavilion} alt="" />
                    <div>
                      <p>HP Pavilion</p>
                      <p> <span style={{textDecoration:"line-through"}}>₹ 1,07,999</span> ₹ 78,500</p>
                    </div>
                  </Link>
                <Link to='product/659b9d2dcb7cd7ec34bd5047'>
                    <img src={onePlus} alt="" />
                    <div>
                      <p>OnePlus 11R</p>
                      <p> <span style={{textDecoration:"line-through"}}>₹ 47,000</span> ₹ 39,999</p>

                    </div>
                  </Link>
                <Link to='product/659c0139691b6d99adf950fd' >
                    <img src={apple} alt="" />
                    <div>
                      <p>AIRPODS  PRO 2</p>
                      <p> <span style={{textDecoration:"line-through"}}>₹ 26,900</span> ₹ 21,990</p>

                    </div>
                </Link>
                <Link to='product/659c04534da2ca548c9c0104'>
                    <img src={fireBolt} alt="" />
                    <div>
                      <p>Fire-Boltt</p>
                      <p> <span style={{textDecoration:"line-through"}}>₹ 7,999</span> ₹ 1099</p>

                    </div>
                  </Link>
              </div>
            </div>
          <div className="paymnetOptions">
            <div>
              <h1>
                {" "}
                <PersonIcon />{" "}
              </h1>
              <p>Buy instantly</p>
              <span>Place your Orders</span>
            </div>
            <div>
              <h1>
                {" "}
                <PublicIcon />{" "}
              </h1>
              <p>Free Shipping</p>
              <span>National and international Shipping</span>
            </div>
            <div>
              <h1>
                {" "}
                <VerifiedUserIcon />{" "}
              </h1>
              <p>Secure payment methods</p>
              <span>100% secure payments</span>
            </div>

            <div>
              <h1>
                {" "}
                <InsertCommentIcon />{" "}
              </h1>
              <p>24/7 Support</p>
              <span>Dedicated support</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
