import React from 'react'
import { Typography, Stepper, StepLabel, Step } from "@material-ui/core";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import './CheckoutSteps.css'

const CheckoutSteps = ({activeStep}) => {
    const steps=[
        {
            label:<Typography  style={{
                color: activeStep >=0 ? "orange" : "rgba(0, 0, 0, 0.649)",
              }}>Shipping Details</Typography>,
            icon:<LocalShippingIcon/>
        },
        {
            label:<Typography  style={{
                color: activeStep >=1 ? "orange" : "rgba(0, 0, 0, 0.649)",
              }}>Confirm Order</Typography>,
            icon:<LibraryAddCheckIcon/>
        },
        {
            label:<Typography  style={{
                color: activeStep >=2 ? "orange" : "rgba(0, 0, 0, 0.649)",
              }}>Payment</Typography>,
            icon:<AccountBalanceIcon/>
        },
    ]
      const stepStyles = {
    boxSizing: "border-box",
  };
  return (
    <>
       <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index ? true : false}
            completed={activeStep >= index ? true : false}
          >
            <StepLabel
              style={{
                color: activeStep >= index ? "orange" : "rgba(0, 0, 0, 0.649)",
              }}
              icon={item.icon}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  )
}

export default CheckoutSteps
