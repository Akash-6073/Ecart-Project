import React, { useEffect,useState } from 'react'
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector,useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { addItemsToCart ,removeItemsFromCart } from '../../actions/cartActions'
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";



const ConfirmOrder = () => {
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const {shippingInfo , cartItems} = useSelector((state)=>state.cart);
    const {loading} = useSelector((state)=>state.user);
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    )
    const shippingCharges = subtotal >=1000 ? 0 : 200;
    const tax = Math.round(subtotal * 0.018);
    const totalPrice =Math.round( subtotal +tax +shippingCharges);
    const {user } =useSelector((state)=>state.user);
    const navigate= useNavigate();
    const alert = useAlert();
    useEffect(()=>{
        if(cartItems.length===0)
        {
            navigate('/cart')
        }
    })
    const proceedToPayment = ()=>{
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        };
        sessionStorage.setItem("orderInfo",JSON.stringify(data))
        navigate('/process/payment')
    }
//     const createdAtDate = new Date(item.createdAt);
//     createdAtDate.setDate(createdAtDate.getDate() + ndays);
// const dayOfWeek = createdAtDate.toLocaleDateString('en-US', { weekday: 'short' });
// const formattedDate = createdAtDate.toLocaleDateString('en-US', { day: 'numeric'});
// const month = createdAtDate.toLocaleDateString('en-US', { month: 'short' });

// const deleteItemsFromCart=(id,name)=>{
//     dispatch(removeItemsFromCart(id));
//     alert.success(`Removed ${name} from your cart Successfully`)
// }

const handleRemoveConfirmation = () => {
    setIsConfirmationDialogOpen(true);
  };

  const handleRemoveConfirmed = (item) => {
    dispatch(removeItemsFromCart(item.product));
    alert.success(`Removed ${item.name} from your cart Successfully`);
    setIsConfirmationDialogOpen(false);
  };

  const handleRemoveCanceled = () => {
    setIsConfirmationDialogOpen(false);
  };
    const dispatch = useDispatch()
    const increaseQuantity = (id,quantity,stock)=>{
        const newQty = quantity+1;
        if(stock<=quantity)
        {
            return;
        }
        dispatch(addItemsToCart(id,newQty));
    }

    const decreaseQuantity = (id,quantity)=>{
        const newQty = quantity-1;
        if(quantity<=1)
        {
            return;
        }
        dispatch(addItemsToCart(id,newQty));
    }

  return (
    <>
      {loading ? <Loader/>:
      <>
    <MetaData title="Confirm Order | eCart.com" />
      <div className="confirmOrders">
      <CheckoutSteps activeStep={1} />
            <div className='orderCfrm'>

                <div className="orderLeft">
                    
                    <div>
                        <h1 style={{fontWeight:"lighter"}}>YOUR CART ({cartItems.length} items) :</h1>
                        <div className="confirmCartItemContainer">
                            {cartItems && 
                                cartItems.map((item)=>(
                                    <div className="confirmCartItemsCard" key={item.product}>
                                <div className="confirmItems">
                                    <div className='cartLeft'>
                                        <div className='imgcartQuant'>
                                        <img src={item.image} alt="ssa" />
                                        <div className='cartQuantity'>
                                                <button disabled={item.quantity < 2}   onClick={()=>decreaseQuantity(item.product,item.quantity)}>-</button>
                                                <input type="number" value={item.quantity} readOnly />
                                                <button disabled={item.quantity >= item.stock} onClick={()=>increaseQuantity(item.product,item.quantity,item.stock)}>+</button>
                                            </div>
                                        </div>
                                        <div>
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            <p>{`Qty : ${item.quantity}`}</p>
                                            <h3>{`₹ ${item.price  * item.quantity}`}</h3>
                                            <p className='cartRemove'   onClick={handleRemoveConfirmation}>REMOVE</p>
                                            <Dialog
        open={isConfirmationDialogOpen}
        onClose={handleRemoveCanceled}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Remove Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this item from the cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveCanceled} color="secondary">
            Cancel
          </Button>
          <Button onClick={()=>handleRemoveConfirmed(item)} color="primary" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
                                        </div>
                                    </div>
                                    <div className="cardRight">
                                    {/* <p>{`Delivery By ${dayOfWeek} ${month} ${formattedDate} `}</p> &nbsp;| &nbsp; <span style={{textDecoration:"line-through"}}>₹50</span> &nbsp; &nbsp;<span style={{color:"green"}}>Free</span> */}
                                    </div>
                                </div>
                            </div> 
                                ))
                            }
                        </div>
                    </div>
                    <div className='delito'>
                    <h1 style={{fontWeight:"lighter"}}>DELIVERY TO :</h1>
                    <ul className='deliveryTo'>
                        <li>
                            {user.name} ,
                        </li>
                        <li>
                            {shippingInfo.address} , {shippingInfo.city} , {shippingInfo.state} - {shippingInfo.pinCode}
                        </li>
                        <li>
                            {shippingInfo.phoneNo}
                        </li>
                    </ul>
                    </div>
                </div>
                <div className="orderRight">
                <div className="confirmPrice">
                    <h1>ORDER &nbsp;SUMMARY</h1>
                    <div>
                        <p>Price ({cartItems.length} items) </p>
                        <p>{`₹${cartItems.reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                        )}`}</p>
                    </div>
                 <div>
                    <p>Delivery Charges</p>
                    {/* <p style={{color:"green"}}>₹{shippingCharges===0?"Free":shippingCharges}</p> */}
                    {shippingCharges === 0 ?
                    <p style={{color:"green"}}><span style={{textDecoration:"line-through",color:"black"}}>₹200</span> Free</p>
                    : "+ ₹"+shippingCharges}
                </div>
            <div>
                <p>Tax</p>
                {/* <p style={{color:"green"}}>₹{shippingCharges===0?"Free":shippingCharges}</p> */}
                {`+ ₹${tax}`}
            </div>
            <div className='ta'>
                <h3>Total Amount</h3>
                <h3>{`₹${totalPrice}`}</h3>
            </div>
                <div className='checkout'>
                    <button onClick={proceedToPayment}   className='btn'>Proceed to Payment <i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
                </div>
                
            </div>
      </div>
      </>}
    </>
  )
}

export default ConfirmOrder
