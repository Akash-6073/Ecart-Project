import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productActions";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartActions";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { myOrders } from "../../actions/orderAction";
const ProductDetails = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //productDeatils we get from store
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const {orders}=useSelector ((state)=>state.myOrders)

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
    const [ans, setans] = useState(false)
  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const { id } = useParams();
  const alert = useAlert();

  const addTocartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Items Added to cart");
  };
  const submitReviewToggle = () => {
    orders && orders.forEach((item)=>{
      if(item.orderStatus==="Delivered")
      {
        item.orderItems.forEach((pid)=>{
          if(pid.product===product._id)
          {
            setans(true);
            return;
          }
        })
        
      }
      console.log(ans);
    })
    // if(ans)
    // {
      return  open ? setOpen(false) : setOpen(true);
    // }
    // return alert.error("Please Purchase the product");
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review Submitted Succesfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    // this will match the id from the backend where we used the "params.id"
    dispatch(getProductDetails(id));
    dispatch(myOrders());

  }, [dispatch, id, error, alert, reviewError, success]);

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name} | eCart.com`} />
          <div className="pd">
            <div className="carousel-container">
              <Carousel className="carou">
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="carousel-image"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
              {/* <div className='buys'>
        <button>Add</button>
        <button>Buy</button>
        </div> */}
            </div>
            <div className="product-details">
              <div className="db1">
                {/* <button className={product.ratings>=4 ? "gc":(product.ratings>2?"yc":"rc")}>{product.ratings} <i className="fa-solid fa-star fa-xs"></i></button>
               &nbsp; &nbsp; */}
                <h2 style={{ fontFamily: "var(--font3)" }}>{product.name}</h2>
                <p
                  style={{
                    fontFamily: "var(--font2)",
                    opacity: "0.4",
                    paddingTop: "5px",
                  }}
                >
                  Product # {product._id}
                </p>
              </div>

              <div className="db2">
                <Rating {...options} />
                <span>({product.numOfReviews} Reviews)</span>
              </div>

              <div className="db3">
                <h1 style={{ fontFamily: "var(--font2)" }}>
                  <span style={{ opacity: "0.6", fontWeight: "lighter" }}>
                    ₹
                  </span>
                  {`${product.price}`}
                </h1>
                <div className="db3_1">
                  <div className="db3_1_1">
                    <button className="incBtn" onClick={decreaseQuantity}>
                      -
                    </button>
                    <input readOnly type="number" value={quantity} />
                    <button className="incBtn" onClick={increaseQuantity}>
                      +
                    </button>
                  </div>{" "}
                  <button
                    className="addCart submitReview"
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addTocartHandler}
                  >
                    <i className="fa-solid fa-cart-shopping"></i> Add to Cart
                  </button>
                </div>
              </div>
              <div className="status">
                <p>
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="db4">
                <h2 style={{ fontFamily: "var(--font3)" }}>Description : </h2>
                <p
                  style={{
                    fontFamily: "var(--font3)",
                    opacity: "0.8",
                    paddingTop: "5px",
                  }}
                >
                  {product.description}  
                </p>
              </div>
              <div>
              <button onClick={submitReviewToggle} className="submitReview">
                Rate Product
              </button>
              </div>
            </div>
          </div>


          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>{ans?"Submit Review ":"Haven't purchased this product?" }</DialogTitle>
            <DialogContent className="submitDialog">
              {ans?<>
                <Rating
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  size="large"
                />
  
                <textarea
                  className="submitDialogTextArea"
                  cols="30"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </> : <>
              Sorry! You are not allowed to review this product since you haven't bought it on Ecart
              </>
              }
            </DialogContent>
            <DialogActions>
              { ans ? <>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
              </> : <>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              </>
              }
            </DialogActions>
          </Dialog>

          <div className="ratingsCard">
            <h1 className="reviewHead homeHeading">Ratings and Reviews</h1>
            {product.reviews && product.reviews[0] ? (
              <div className="reviews">
                {product.reviews &&
                  product.reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
              </div>
            ) : (
              <p
                className="noreviews"
                style={{ fontWeight: "lighter", opacity: "0.4" }}
              >
                No Reviews Yet
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
