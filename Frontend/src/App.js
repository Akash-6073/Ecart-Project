import "./App.css";
import React ,{useEffect, useState} from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/layout/Header/Header";
import Home from "./components/Home/Home";
import Footer from "./components/layout/Footer/Footer";
import ProductDetails from "./components/Product/ProductDetails";
import ScrollToTop from "./components/ScrollToTop";
import Products from "./components/Product/Products";
import LoginSignup from "./components/User/LoginSignup";
import { loadUser } from "./actions/userAction";
import store from "./store";
// import UserOptions from "./components/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./components/User/Profile";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import axios from 'axios'
import Payment from "./components/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import ProtectedRoute2 from "./components/Route/ProtectedRoute2";
import OrderDetails from "./components/Order/OrderDetails";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList";
import NewProduct from "./components/Admin/NewProduct";
import UpdateProduct from "./components/Admin/UpdateProduct";
import OrderList from "./components/Admin/OrderList";
import UpdateOrder from "./components/Admin/UpdateOrder";
import UsersList from "./components/Admin/UsersList";
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReview from "./components/Admin/ProductReview";
import Contact from "./components/Contact/Contact";
import NotFound from "./components/layout/NotFound/NotFound";

function App() {
     console.log(window.location.pathname)
  const{isAuthenticated,loading,user} = useSelector((state)=>state.user)
  const [stripeApiKey, setStripeApiKey] = useState("")

  //  GETTING   AXIOS ERROR
  async function getStripeApiKey(){
    try {
      const response = await axios.get('https://ecart1.onrender.com/api/v1/stripeapiKey', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setStripeApiKey(response.data.stripeApiKey);
    } catch (error) {
      console.error('Error fetching Stripe API key:', error);
      // Handle the error, for example, by displaying a message to the user
    }
  }
  
  useEffect(() => {
    if (!isAuthenticated) {
      // Only dispatch loadUser if the user is not authenticated
      store.dispatch(loadUser());
    }
    getStripeApiKey();
  }, [isAuthenticated]);

  // This will not allow to inspect
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <Router>
          <ScrollToTop/>
      <Header />
      { stripeApiKey &&  (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Routes>
              <Route exact path= "/process/payment" element = {<ProtectedRoute user={user} isAuthenticated={isAuthenticated} loading={loading} >
                    <Payment/>
              </ProtectedRoute>}/>
              
              </Routes>
          </Elements>
      )}
      <Routes>
         <Route  exact path="/" element={<Home/>}/>
      <Route exact path= "/products/:keyWord" element = {<Products/>}/>
      <Route exact path="/product/:id" element={<ProductDetails/>}/>
         <Route exact path= "/products" element = {<Products/>}/>
      <Route exact path= "/contactUs" element = {<Contact/>}/>

         <Route exact path = '/account' element = {<ProtectedRoute2 isAuthenticated={isAuthenticated} loading={loading} >
              <Profile/>
         </ProtectedRoute2>}/>

         <Route exact path= "/me/update" element = {<ProtectedRoute2 isAuthenticated={isAuthenticated} loading={loading} >
              <UpdateProfile/>
         </ProtectedRoute2>}/>

         <Route exact path= "/password/update" element = {<ProtectedRoute isAuthenticated={isAuthenticated} loading={loading} >
              <UpdatePassword/>
         </ProtectedRoute>}/>

         <Route exact path= "/password/forgot" element = {<ForgotPassword/>}/>
         <Route exact path="/password/reset/:token" element={<ResetPassword/>}/>
         <Route exact path= "/login" element = {<LoginSignup/>}/>
         <Route exact path="/cart" element={<Cart/>}/>

         <Route exact path= "/login/shipping" element = {<ProtectedRoute user={user} isAuthenticated={isAuthenticated} loading={loading} >
              <Shipping/>
         </ProtectedRoute>}/>

         

         <Route exact path= "/success" element = {<ProtectedRoute user={user} isAuthenticated={isAuthenticated} loading={loading} >
              <OrderSuccess/>
         </ProtectedRoute>}/>

         <Route exact path= "/order" element = {<ProtectedRoute isAuthenticated={isAuthenticated} loading={loading} >
              <MyOrders/>
         </ProtectedRoute>}/>

         {/* ADMIN */}
         <Route exact path= "/Admin/dashboard" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <Dashboard/>
         </ProtectedRoute>}/>
         
         <Route exact path= "/Admin/products" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <ProductList/>
         </ProtectedRoute>}/>

         <Route exact path= "/Admin/product" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <NewProduct/>
         </ProtectedRoute>}/>

         <Route exact path= "/Admin/product/:id" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <UpdateProduct/>
         </ProtectedRoute>}/>

         <Route exact path= "/Admin/orders" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <OrderList/>
         </ProtectedRoute>}/>

         <Route exact path= "/Admin/order/:id" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <UpdateOrder/>
         </ProtectedRoute>}/>

         <Route exact path= "/Admin/users" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <UsersList/>
         </ProtectedRoute>}/>

         <Route exact path= "/Admin/user/:id" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <UpdateUser/>
         </ProtectedRoute>}/>

         <Route exact path= "/Admin/reviews" element = {<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated} user={user} loading={loading} >
              <ProductReview/>
         </ProtectedRoute>}/>
         <Route exact path= "/order/confirm" element = {<ProtectedRoute user={user} isAuthenticated={isAuthenticated} loading={loading} >
                <ConfirmOrder/>
          </ProtectedRoute>}/>
          <Route exact path= "/order/:id" element = {<ProtectedRoute isAuthenticated={isAuthenticated} loading={loading} >
                <OrderDetails/>
          </ProtectedRoute>}/>
          <Route path="/*"
          element={
           ( window.location.pathname ==="/login/shipping" ||  window.location.pathname ==="/process/payment" ) ? null : <NotFound/>
          }
        />
      </Routes>
          
    
        {/* {isAuthenticated && <UserOptions user={user}/>} */}
      <Footer/>
    </Router>
  );
}

export default App;
