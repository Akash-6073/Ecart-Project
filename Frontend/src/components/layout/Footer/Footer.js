import React from "react";
import playStore from "../../../images/playstore.png";
import stripe from "../../../images/stripe.png";
import "./Footer.css";
import { Link} from "react-router-dom";

const Footer = () => {
  return (
    <>
     <div className="foot">
        <div className="footBook">
            <h2>  Ecart <sup style={{fontSize:"10px"}}>TM</sup>  </h2>
            <div className="playstore">
            <img src={playStore} alt="" />
          </div>
        </div>
        <div>
            <ul className="unorderLi">
                <li  className="footHeading">Features</li>
                <li>Cool stuff</li>
                <li>Random feature</li>
                <li>Team feature</li>
                <li>Stuff for developers</li>
                <li>Another one</li>
                <li>Last time</li>
            </ul>
        </div>
        <div>
            <ul className="unorderLi">
                <li  className="footHeading">Resources</li>
                <li>Resource</li>
                <li>Resource name</li>
                <li>Another Resource</li>
                <li>Final resource</li>
            </ul>
        </div>
        <div>
            <ul className="unorderLi">
                <li className="footHeading" >About</li>
                <li>Team</li>
                <li> Locations</li>
                <li>Privacy</li>
                <li>Terms</li>
            </ul>
        </div>
        <div>
            <ul className="unorderLi">
                <li className="footHeading" >Social</li>
                <li>Facebook</li>
                <li> Instagram</li>
                <li>Whatsapp</li>
                <li>Terms</li>
            </ul>
        </div>
        
    </div>
        <div className="copyRight">
          <Link to='/contactUs'>Help Center</Link>
            <p  > made with ❤️ by akashMahendrakar</p>
            <p  > &copy; 2023 All rights Reserved | istore.com</p>
            <img src={stripe} alt="" />
        </div>
    </>
  );
};

export default Footer;