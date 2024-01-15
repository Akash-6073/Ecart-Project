import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(
    (e) => {
      if (!isAuthenticated) {
        navigate("/login");
      }
    },
    [isAuthenticated, navigate]
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${user.name}'s Profile | eCart.com`} />
          <div className="profileConatiner">
            <h1>
              - MY  &nbsp; PROFILE -
            </h1>
            <div className="profID">
              <div className="profImg">
                <h1>Welcome back</h1>
                <img src={user.avatar.url} alt={user.name} />
                <p>
                  {" "}
                  <Link to="/order">
                    <button className="btn">
                      <i className="fa-solid fa-cart-shopping"></i> My Orders
                    </button>
                  </Link>
                </p>
              </div>
              <div className="profDetails">
                <div className="profDtl1">
                  <div className="profOrange">
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                  </div>
                  <div className="profViolet">
                    <h4>Email</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="profDtl2">
                  <div className="profGrey">
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substring(0, 10)}</p>
                  </div>
                  <div className="profBlue">
                    <p>
                      <Link to="/password/update">
                        <button className="btn">Change Password</button>
                      </Link>
                    </p>{" "}
                    <br />
                    <p>
                      <Link to="/me/update">
                        <button className="btn">
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                          Profile
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
