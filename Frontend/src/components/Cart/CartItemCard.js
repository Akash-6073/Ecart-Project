import React ,{useState} from 'react'
import './CartItemCard.css'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItemsToCart } from '../../actions/cartActions'
import { useAlert } from 'react-alert'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
const CartItemCard = ({item,deleteItemsFromCart,cartLen,shippingCharges}) => {
    const alert = useAlert();
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    let ndays = 2;
    if(cartLen <=3 && cartLen>1)
    {
        ndays = 3;
    }
    else if(cartLen >3)
    {
        ndays = 4;
    }
    const createdAtDate = new Date(item.createdAt);
createdAtDate.setDate(createdAtDate.getDate() + ndays);
const dayOfWeek = createdAtDate.toLocaleDateString('en-US', { weekday: 'short' });
const formattedDate = createdAtDate.toLocaleDateString('en-US', { day: 'numeric'});
const month = createdAtDate.toLocaleDateString('en-US', { month: 'short' });
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

    const handleRemoveConfirmation = () => {
        setIsConfirmationDialogOpen(true);
      };
    
      const handleRemoveConfirmed = () => {
        deleteItemsFromCart(item.product, item.name);
        setIsConfirmationDialogOpen(false);
      };
    
      const handleRemoveCanceled = () => {
        setIsConfirmationDialogOpen(false);
      };
    
  
  return (
    <>
     <div className="CartItemCards">
        <div className="cartItemCard">
            <div className='cardLeft'>
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
        PaperProps={{
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
          BackdropProps={{
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
      >
        <DialogTitle id="alert-dialog-title">{"Remove item"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this item from the cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveCanceled} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRemoveConfirmed} color="primary" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
                </div>
            </div>
            <div className="cardRight">
            <p>{`Delivery By ${dayOfWeek} ${month} ${formattedDate} `}</p> &nbsp;| &nbsp;    {shippingCharges === 0 ?
                <p style={{color:"green"}}><span style={{textDecoration:"line-through",color:"black"}}>₹200</span> Free</p>
                : "₹"+shippingCharges}
            </div>
        </div>
     </div> 
    </>

  )
}

export default CartItemCard
