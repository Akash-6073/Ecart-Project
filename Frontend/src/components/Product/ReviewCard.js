import React from 'react'
import profile from '../../images/profile.png'
import { Rating } from "@material-ui/lab";


const ReviewCard = ({review}) => {
    const options = {
        size:"small",
        value:review.rating,
        ishalf:true,
        readOnly:true,
        precision:0.5,
    }
  return (
    <div className='reviewCard'>
      <div className='rateBtn'>
      <button className={review.rating>=4 ? "gc":(review.rating>2?"yc":"rc")}>{review.rating} <i className="fa-solid fa-star fa-xs"></i></button>&nbsp;<span>Certified Buyer <i className="fa-solid fa-check"></i></span> 
      </div>
      <img src={profile} alt="" />
      <p>{review.name} </p>
      <Rating {...options}/>
      <span className='rComment'>{review.comment}</span>
    </div>
  )
}

export default ReviewCard
