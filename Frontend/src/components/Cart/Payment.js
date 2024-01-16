import React, {useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./Payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useNavigate } from "react-router-dom";
import { createOrder, clearErrors } from "../../actions/orderAction";


const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const payBtn = useRef(null)
    const stripe = useStripe();
    const elements = useElements();
    const {shippingInfo , cartItems} = useSelector((state)=>state.cart);
    const {user } =useSelector((state)=>state.user);
    const {error } =useSelector((state)=>state.newOrder);
    
    
    const paymentData = {
        amount: Math.round(orderInfo.totalPrice/83 * 100),
      };
      const order={
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
      }
      
    const submitHandler=async (e)=>{
        e.preventDefault();
        payBtn.current.disabled=true;

        try {
        const config = {headers:{"Content-Type":"application/json"}}
        const {data} = await axios.post("https://ecartserver.onrender.com/api/v1/payment/process",paymentData,config)
        const client_secret = data.client_secret;
        
        if(!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(client_secret,{
            payment_method:{
                card:elements.getElement(CardNumberElement),
               
                billing_details: {
                    name: user.name,
                    email: user.email,
                    address: {
                      line1: shippingInfo.address,
                      city: shippingInfo.city,
                      state: shippingInfo.state,
                      postal_code: shippingInfo.pinCode,
                      country:"US",
                    },
            },
            
        }
        
        })
        if (result.error) {
            payBtn.current.disabled = false;
    
            alert.error(result.error.message);
          } else {
            if (result.paymentIntent.status === "succeeded") {
              order.paymentInfo = {
                id: result.paymentIntent.id,
                status: result.paymentIntent.status,
              };
    
              dispatch(createOrder(order));
    
              navigate("/success");
            } 
            else {
              alert.error("There's some issue while processing payment ");
            }
        }

        } catch (error) {
        payBtn.current.disabled=false;
            
        }
    }
    useEffect(() => {
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
      
    }, [dispatch, error, alert]);
  return (
    <>
    <MetaData title="Payment  | eCart.com" />
    <div className="paymentContainer">
    <CheckoutSteps activeStep={2} />
      <div className="paymentBox">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
        <h2 className="paymentHeading">CARD&nbsp; INFO</h2>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`PAY - $${orderInfo && Math.round(orderInfo.totalPrice/83)}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
      </div>
  </ >
  )
}

export default Payment
