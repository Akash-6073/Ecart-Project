import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import "./UpdateOrders.css";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { getOrderDetails, clearErrors, updateOrder } from "../../actions/orderAction";
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import Sidebar from './Sidebar';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";



const UpdateOrder = () => {
    const { order, error,loading } = useSelector((state) => state.orderDetails);
    const { error: updateError, isUpdated } = useSelector((state) => state.order);
    
    const{id} = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    let cartLen;
    let ndays = 2;
    const [status, setStatus] = useState("");
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

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    dispatch(updateOrder(id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
        alert.error(updateError);
        dispatch(clearErrors());
      }
      if (isUpdated) {
        alert.success("Order Updated Successfully");
        dispatch({ type: UPDATE_ORDER_RESET });
      }
    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, id,updateError,isUpdated]);
    
     
  return (
    <>
      {loading ? <Loader/>:
       <div className="dashboardAdmin">
                <Sidebar />
      <>
      <div className="UpdateOrders">
            <div className='updateOrderCfrm'>

                <div className="upadateOrderLeft">
                   
               
      
                </div>

                 <div className="updateOrderRight">
                {/* <div className="confirmPrice">
                    <h1>Order Summary</h1>
                    <div>
                        <p>Price ({cartItems.length} items) </p>
                        <p>{`₹${cartItems.reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                        )}`}</p>
                    </div>
                 <div>
                    <p>Delivery Charges</p>
                    <p style={{color:"green"}}>₹{shippingCharges===0?"Free":shippingCharges}</p>
                    {shippingCharges === 0 ?
                    <p style={{color:"green"}}><span style={{textDecoration:"line-through",color:"black"}}>₹200</span> Free</p>
                    : "+ ₹"+shippingCharges}
                </div>
            <div>
                <p>Tax</p>
                <p style={{color:"green"}}>₹{shippingCharges===0?"Free":shippingCharges}</p>
                {`+ ₹${tax}`}
            </div>
            <div className='ta'>
                <h3>Total Amount</h3>
                <h3>{`₹${totalPrice}`}</h3>
            </div>
                <div className='checkout'>
                    <button onClick={proceedToPayment}   className='btn'>Proceed to Payment</button>
                </div>
            </div> */}
            <div className='orderStatusUpdate'
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h2 style={{fontWeight:"lighter"}}>PROCESS &nbsp; ORDER</h2>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Update Status</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>
                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Update
                  </Button>
                </form>
              </div>
                </div>
                
            </div>
            <div className=" updateOrderDetails">
            {/* <h1 >Order Details</h1> */}
         <div className="orderIn">
            <div className="updateOrderId">
                <div className="updateOrderIdLeft">
                <p>#{id}</p>

                </div>

                <div className="updateOrderIdRight">
                    <Link>Status : <span style={{fontWeight:"bold"}} className={order.orderStatus && order.orderStatus === "Delivered"? "greenColor": "redColor"}>
                                    {order.orderStatus && order.orderStatus}
                                </span></Link>
                </div>
            </div>
            {order.orderItems && order.orderItems.map((item)=>(
                    <div className="orderItems" key={item.product}>
                            <div className="updateItemsLeft">
                                <img src={item.image} alt="" />
                                <div>
                                    <p className="">{item.name}</p>
                                    <p>Qty : {item.quantity}</p>
                                </div>
                            </div>
                            <div className="updateItemsright">
                                <p className="">₹{item.price * item.quantity}</p>
                            </div>
                    </div>
                ))}
            <div className=" updateOrderDateAmt">
                <div className='updateOrderDateAmtLeft deliveryDetails'>
                        <ul className='updateDeliveryTo'>
                          <h1>Shipping Info</h1>
                            <li>
                            {order.user && order.user.name} ,
                            </li>
                            <li>
                            {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} - ${order.shippingInfo.pinCode}`}                        </li>
                            <li>
                            {order.shippingInfo && order.shippingInfo.phoneNo}
                            </li>
                            <li>
                        <p className="" style={{paddingTop:"15px"}}> <span>Ordered On : </span> {oday} , {omonth} {odate} &nbsp;'{oyear}</p>

                            </li>
                        </ul>
                        </div>
                  <div className='updateOrderDateAmtRight'>

                        <p className="" style={{paddingTop:"15px"}}><span>Grand Total : &nbsp; </span>₹{order.totalPrice}</p>
                        <p
                        className={
                            order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "greenColor bgPaid"
                            : "redColor bgPaid"
                        }
                        style={{fontWeight:"bold"}}
                        >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                        ? "PAID"  
                        : "NOT PAID"}
                      </p>
                  </div>
                </div>
         </div>
             </div>
              
      </div>
      </>
      </div>
        }
    </>
  )
}

export default UpdateOrder
