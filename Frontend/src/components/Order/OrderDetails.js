import React, {  useEffect } from "react";
import './OrderDetails.css'
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link,useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
const OrderDetails = () => {
    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const{id} = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  let cartLen;
  if(order && order.orderItems)
  {
      cartLen = order.orderItems.length;

  }
  let ndays = 2;
  if(cartLen <=3 && cartLen>1)
  {
      ndays = 3;
  }
  else if(cartLen >3)
  {
      ndays = 4;
  }
  const createdAtDate = new Date(order && order.createdAt);
  const dateOrdered = new Date(order && order.createdAt);
createdAtDate.setDate(createdAtDate.getDate() + ndays);
const dayOfWeek = createdAtDate.toLocaleDateString('en-US', { weekday: 'short' });
const date = createdAtDate.toLocaleDateString('en-US', { day: 'numeric'});
const year = createdAtDate.toLocaleDateString('en-US', { year: 'numeric'}).slice(-2);
const month = createdAtDate.toLocaleDateString('en-US', { month: 'short' });

const oday = dateOrdered.toLocaleDateString('en-US', { weekday: 'short' });
const odate = dateOrdered.toLocaleDateString('en-US', { day: 'numeric'});
const oyear = dateOrdered.toLocaleDateString('en-US', { year: 'numeric'}).slice(-2);
const omonth = dateOrdered.toLocaleDateString('en-US', { month: 'short' });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, id]);
  return (
    <>
     {loading?(<Loader/>)
     :(
        <>
          <MetaData title={`Order Details | eCart.com`} />

         <div className="OrderDetails">
            <h1><span>MY ORDERS {`>`}</span> ORDER DETAILS</h1>
         <div className="orderIn">
            <div className="orderId">
                <div className="orderIdLeft">
                <p>#{id}</p>
                </div>
                 
            </div>
            {order.orderItems && order.orderItems.map((item)=>(
                    <div className="orderItems" key={item.product}>
                            <div className="orderItemsLeft">
                                <img src={item.image} alt="" />
                                <div>
                                    <p className="highLight">{item.name}</p>
                                    <p>Qty : {item.quantity}</p>
                                </div>
                            </div>
                            <div className="orderItemsRight">
                                <p className="highLight">₹{item.price * item.quantity}</p>
                                <div>
                                    {order.orderStatus !== "Delivered" && <><p className="highLight deliveredShip" style={{paddingBottom:"8px"}}>Delivery Expected by {dayOfWeek} , {month} {date} &nbsp;'{year}</p>
                                    <p className="orderPlaced" style={{color:"rgba(0, 0, 0, 0.71)"}}>Your order has been Placed</p></>}
                                </div>
                                <div>
                                <span>Status :</span> <span className={order.orderStatus && order.orderStatus === "Delivered"? "greenColor": "redColor"}>
                                    {order.orderStatus && order.orderStatus}
                                </span>
                                </div>
                            </div>
                    </div>
                ))}
            <div className="orderDateAmt">
                <div className="orderDate">
                    <div>
                    <p >Delivery to :</p>
                    <p>{order.user && order.user.name}</p>
                    <p>{order.shippingInfo &&
                      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} - ${order.shippingInfo.pinCode}`}</p>
                      <p>{order.shippingInfo && order.shippingInfo.phoneNo}</p>
                    </div>
                    <p className="highLight orderedDate" style={{paddingTop:"15px"}}> <span>Ordered On : </span> {oday} , {omonth} {odate} &nbsp;'{oyear}</p>

                    
                </div>
                <div className="totalAmt">
                    <p
                    className={
                        order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                    style={{textAlign:"right",paddingTop:"5px"}}
                    >
                    {order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                    ? "PAID"  
                    : "NOT PAID"}
                  </p>
                    <p className="highLight totalSumOrder" style={{paddingTop:"15px"}}><span>Order Total : &nbsp; </span>₹{order.totalPrice}</p>
                </div>
            </div>
         </div>
      </div>
        
        </>
     )}
    </>
  )
}

export default OrderDetails
