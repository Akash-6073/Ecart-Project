import React, { useState } from 'react'
import './Shipping.css'
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import PinDropIcon from "@material-ui/icons/PinDrop";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps';
import { saveShippingInfo } from '../../actions/cartActions';

const Shipping = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate()
    const {shippingInfo} = useSelector((state)=>state.cart)
    const [address,setAddress] = useState(shippingInfo.address);
    const [city,setCity] = useState(shippingInfo.city)
    const [state,setState] = useState(shippingInfo.state)
    const [country,setCountry] = useState(shippingInfo.country)
    const [pinCode,setPinCode] = useState(shippingInfo.pinCode)
    const [phoneNo,setPhoneNo] = useState(shippingInfo.phoneNo)
    const shippingSubmit=(e)=>{
        e.preventDefault();
        if(phoneNo.length<10 || phoneNo.length>10)
        {
            alert.error("Phone Number Should be 10 digits");
            return;
        }
        dispatch(
            saveShippingInfo({address,city,state,country,pinCode,phoneNo})
        )
        navigate('/order/confirm')
    }
  return (
    <>
    <MetaData title="Shipping Details | eCart.com" />


    <div className="shippingContainer">
    <CheckoutSteps activeStep={0} />
      <div className="shippingBox">
        
        <form
          className="shippingForm"
          encType="multipart/form-data"
          onSubmit={shippingSubmit}
        >
        <h2 className="shippingHeading">SHIPPING &nbsp;DETAILS</h2>
          <div>
            <HomeIcon className='fontIcons' />
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <LocationCityIcon className='fontIcons' />
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <PinDropIcon className='fontIcons' />
            <input
              type="number"
              placeholder="Pin Code"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>

          <div >
            <PhoneIcon className='fontIcons'  />
            <input
              type="number"
              placeholder="Phone Number"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              size="10"
            />
          </div>

          <div>
            <PublicIcon className='fontIcons' />

            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {country && (
            <div>
              <TransferWithinAStationIcon className='fontIcons' />

              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">State</option>
                {State &&
                  State.getStatesOfCountry(country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* <input
            type="submit"
            value="Continue"
            className="shippingBtn"
            disabled={state ? false : true}
          />  */}
          <button   type="submit"
            value="Continue"
            className="shippingBtn"
            disabled={state ? false : true}>
            Continue &nbsp;<i className="fa-solid fa-arrow-right"></i>
          </button>

        </form>
      </div>
    </div>
  </ >
  )
}

export default Shipping
