import React from 'react'
import akash from '../../images/akash.jpg'
import './Contact.css'
import MetaData from "../layout/MetaData";

const Contact = () => {
  return (
    <>
     <MetaData
            title={
              "Contact Us | eCart.com"
            }
          />
       <div className="about" style={{minHeight:'100vh'}}>
      <h1 className="ContactUs" style={{fontFamily:"var(--font3)",textUnderlineOffset:"5px",textDecorationThickness:'1.5px',fontWeight:"lighter"}}>CONTACT US</h1>
      <div className="aboutContainer">
        <div className="aboutLeft">
          <img src={akash} alt="" />
          <h4 className='siteDeveloper' style={{fontFamily:"var(--font3)",letterSpacing:"1px",fontWeight:"lighter",padding:"5px 0"}}>DEVELOPER <i className="fa-solid fa-code"></i></h4>
          <a href='mailto:akashmahendrakar6073@gmail.com' className='emailContact'>EMAIL</a>
          <p>Discover convenience and quality at your fingertips - explore the latest trends and unbeatable deals on our user-friendly ecommerce platform <br />Made with <i className="fa-regular fa-heart"></i> by <span style={{textDecoration:"underline",textUnderlineOffset:"3px",}}>Akash Mahendrakar</span></p>
        </div>
        {/* <div className='aboutHr'>
        <hr  />
        </div> */}
        <div className="aboutRight">
          <h2 style={{fontFamily:"var(--font3)"}}>Contact me on</h2> 
          <div className="aboutMedia">
              
              <h1>
              <a target='_blank' rel="noreferrer" href="https://www.linkedin.com/in/akash-mahendrakar-59b8a1220/" style={{color:"#0a66c2"  }}><i className="fa-brands zoom fa-linkedin"></i></a> 

              </h1>
              <h1>
    
              <a target='_blank' rel="noreferrer" href="https://www.instagram.com/akash__mahendrakar/"><i className="fa-brands zoom fa-instagram" style={{color:"#e1306c"  }}></i></a> 

              </h1>
              <h1>
           <a target='_blank' rel="noreferrer" href="https://github.com/Akash-6073"><i className="fa-brands zoom fa-github" style={{color:"#111"}}></i></a> 

              </h1>
          </div>
        </div>
      </div>
     </div>
     
    </>
  )
}

export default Contact
