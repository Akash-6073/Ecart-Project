import React from 'react'
import { Link } from 'react-router-dom'
// import ReactStars from 'react-rating-stars-component'
// import { Rating } from "@material-ui/lab";


const  ProductCard = ({product}) => {
  const options = {
    size:"small",
    value:product.ratings,
    readOnly:true,
    precision:0.5
}
  return (
     <Link className='productCard' to={`/product/${product._id}`} style={{textDecoration:"none"}}>
      <div className='pcRate'>
        <button className={product.ratings>=3.5 ? "bestSeller":"bestSellerNone"}>Best Seller</button>
      </div>
        <img src={product.images[0].url} alt={product.name} />
        <p >{product.name} </p>
        <div >
        <button style={{ display: product.ratings === 0 ? "none" : "inline-block" }} className={product.ratings>=4 ? "gc":(product.ratings>2?"yc":"rc")}>{product.ratings.toFixed(1)} <i className="fa-solid fa-star fa-xs"></i></button>
            &nbsp;<span style={{color:"rgba(0, 0, 0, 0.67)",fontWeight:"lighter"}}>({product.numOfReviews} Reviews)</span>
        </div>
        <span className='price'>₹{product.price}</span>
     </Link>

  )
}

export default ProductCard
