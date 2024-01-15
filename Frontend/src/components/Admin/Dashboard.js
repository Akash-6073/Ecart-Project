import React ,{useEffect}from 'react'
import './Dashboard.css'
import Sidebar from './Sidebar'
import Loader from '../layout/Loader/Loader'
import { Typography } from "@material-ui/core";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import {CategoryScale} from 'chart.js'; 
import { useSelector, useDispatch } from "react-redux";
// import { getAllOrders } from "../../actions/orderAction.js";
// import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";
import Chart from 'chart.js/auto'
import { clearErrors ,getAdminProduct} from '../../actions/productActions';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';
const Dashboard = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector((state)=>state.user)

  const {products,error} = useSelector((state)=>state.products);

  const { orders } = useSelector((state) => state.allOrders);

  const {users} = useSelector((state)=>state.allUsers)


  let outOfStock = 0;
  products && products.forEach((item)=>{
    if(item.Stock===0){
      outOfStock+=1;
    }
  })
  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  useEffect(()=>{
    if(error)
    {
        alert.error(error);
        dispatch(clearErrors());
    }
    dispatch(getAdminProduct())
    dispatch(getAllOrders())
    dispatch(getAllUsers());
},[dispatch,alert,error]);

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["#5D3FD3"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#f22260", "#4dc64d"],
        hoverBackgroundColor: ["#e20f4f99", "#4dc64da4"],
        data: [outOfStock ,products.length - outOfStock],
      },
    ],
  };
  return (
    <>
      { loading ? <Loader/>:
        <>
         <MetaData
            title={
              "Admin Dashboard | eCart.com"
            }
          />
             <div className="dashboardAdmin">
                <Sidebar />
                <div className="dashboardContainer">
                  <div className="dashboardBoxes">
                    <Link className='boxViolet'>
                      <div >
                        <p>Total Sales Amount</p> <br />
                        <h3>₹ {totalAmount}</h3>
                      </div>
                      </Link>
                        <Link   className='boxRed' to='/Admin/products'>
                      <div >
                      <p>Products</p> <br />
                        <h3>{products && products.length}</h3>
                      </div>
                        </Link>
                        <Link   className='boxYellow' to='/Admin/orders'>
                      <div >
                      <p>Orders</p> <br />
                        <h3>{orders && orders.length}</h3>
                      </div>
                        </Link>
                        <Link   className='boxGreen' to='/Admin/users'>
                      <div >
                      <p>Users</p> <br />
                        <h3>{users && users.length}</h3>
                      </div>
                        </Link>
                  </div>
                  <div className="dashboardGraph">
                      <div className="lineChart">
                        <Line data={lineState} className='line'/>
                      </div>
                      <div className="pieChat">
                        <h2>Stock Status</h2>
                        <Doughnut data={doughnutState} />
                      </div>
                  </div>
                </div>
      </div>
        </>
        }
    </>
  )
}

export default Dashboard
