import React, { useState } from 'react'
import './Cart.css'
import CartItemCard from './CartItemCard'
import prof from '../../images/top1.jpg'
import { useSelector,useDispatch } from 'react-redux'
import { removeItemsFromCart } from '../../actions/cartActions'
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link ,useNavigate} from 'react-router-dom'
import { useAlert } from 'react-alert'
import MetaData from "../layout/MetaData";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {cartItems} = useSelector((state)=>state.cart)
    const nItems = cartItems.length

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    )
    const shippingCharges = subtotal >=1000 ? 0 : 200;
    const tax = Math.round(subtotal * 0.018);
    const totalPrice =Math.round( subtotal +tax +shippingCharges);
    const deleteItemsFromCart=(id,name)=>{
        dispatch(removeItemsFromCart(id));
        alert.success(`Removed ${name} from your cart Successfully`)
    }
    const checkoutHandler = ()=>{
        navigate('/login?redirect=shipping')
    }
  return (
    <>
     <MetaData
            title={
              "Cart Items | eCart.com"
            }
          />
    {cartItems.length===0 ? <>
        <div className="emptyCart">
         <RemoveShoppingCartIcon className='blink'/>
          <Typography>No Product in Your Cart !</Typography>
          <Link to="/products">View Products</Link>
        </div>
    
    </>:
    <>
    <div className="cartAndPrice">
        <div className="carts">
        <h2>CART ITEMS</h2>
        <div className="cartHeaders">
            <h1> <i className="fa-solid fa-bag-shopping"></i> Your Bag  ({cartItems.length} items)</h1> 
        </div>
        {cartItems && cartItems.map((item)=>(
            <div className="cartDetails" key={item.product}>
            <CartItemCard item={item} shippingCharges={shippingCharges}  deleteItemsFromCart={deleteItemsFromCart} cartLen={nItems}/>
            </div>
        ))}
        </div>
        <div className="priceDetails">
            <h1>PRICE DETAILS</h1>
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

            <button onClick={checkoutHandler} className='btn checkBtn'>Check Out <i className="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>
        </div>
    </>
    }

    </>
  )
}

export default Cart
