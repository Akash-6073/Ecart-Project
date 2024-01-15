import React, { useEffect, useState } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productActions";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import {Typography,FormControlLabel, Checkbox} from "@material-ui/core";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import notFound from '../../images/notFound.png'

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);

  const [price, setPrice] = useState([0, 150000]);

  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0);
  const [priceFilterEnabled, setPriceFilterEnabled] = useState(false);


  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const categories = [
    "Laptop",
    "Footwear",
    "Airpods",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];
  //state.products we get from store
  const {
    loading,
    products,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const { keyWord } = useParams();
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };


  const handleCheckboxChange = (event, range) => {
    const { checked } = event.target;
    setPriceFilterEnabled(checked);

    // Reset the price range if the checkbox is unchecked
    if (!checked) {
      setPrice([0, 150000]);
      return;
    }

    // Set the price range based on the selected checkbox
    switch (range) {
      case '0-10000':
        setPrice([0, 10000]);
        break;
      case '10000-20000':
        setPrice([10000, 20000]);
        break;
      case '20000 & above':
        setPrice([20000, 150000]);
        break;
      case '30000 & above':
        setPrice([30000, 150000]);
        break;
      case '40000 & above':
        setPrice([40000, 150000]);
        break;
      // Add more cases for additional ranges
      default:
        setPrice([0, 150000]); // Default to full range if no match
    }
  };

  const isCheckboxChecked = (range) => {
    return priceFilterEnabled && price[0] === parseInt(range.split('-')[0]);
  };


  const ratingHandler = async (rate) => {
    setRatings(rate);
  };
  let count = filteredProductsCount;
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    // getProduct is from actions
    dispatch(getProduct(keyWord, currentPage, price, category, ratings));
  }, [dispatch, keyWord, currentPage, price, category, ratings, error, alert]);

  const scrollToFilters = () => {
    const filtersSection = document.getElementById("addfiltersHere");
    if (filtersSection) {
      filtersSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Buy Latest Products | eCart.com" />
          <div className="pPage">

            
            {/* <hr  style={{opacity:"0.2"}}/> */}
            {count===0 ? <>
              <div className="emptyCart emptyProd">
              <img src={notFound} alt="" />
          <Typography>Sorry, no results found!</Typography>
          <p className="notFound">Please check the spelling or try searching for something else</p> <br />
        </div>
            
            </> :
            <>
            <div className="filtsProd">
              <div className="filters" id="addfiltersHere">
                <h1>
                  FILTERS <i className="fa-solid fa-filter fa-xs"></i>
                </h1>
                <hr style={{ padding: "0" }} />
                {/* <div className="priceFilter">
                  <Typography>PRICE</Typography>
                  <div>
                    <Slider
                      value={price}
                      onChange={priceHandler}
                      valueLabelDisplay="on"
                      aria-labelledby="range-slider"
                      min={0}
                      max={150000}
                    />
                  </div>
                </div> */}
                <div className="category">
                  <Typography className="typoHead" style={{padding:"5px 0"}}>CATEGORIES</Typography>
                  <select
                    className="categoryBox"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All</option>
                    {categories.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              <div className="priceFilter">
              <Typography className="typoHead" >PRICE</Typography>
              {['0-10000', '10000-20000', '20000 & above', '30000 & above' , '40000 & above'].map((range) => (
                <FormControlLabel
                  key={range}
                  control={
                    <Checkbox
                      checked={isCheckboxChecked(range)}
                      onChange={(event) => handleCheckboxChange(event, range)}
                      color="primary"
                    />
                  }
                  label={range}
                />
              ))}
              {priceFilterEnabled && (
                <div>
                  <Slider
                  className="sliderLabel"
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="on"
                    aria-labelledby="range-slider"
                    min={0}
                    max={150000}
                  />
                </div>
              )}
              </div>
              

                <div className="ratings">
                  <Typography className="typoHead">CUSTOMER RATINGS</Typography>
                  <ul>
                    <li>
                      <input
                        type="radio"
                        name="rating"
                        checked={ratings === 0}
                        onClick={() => ratingHandler(0)}
                        id=""
                        onChange={(e) => {}}
                      />
                      &nbsp;1 & above
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="rating"
                        checked={ratings === 2}
                        onClick={() => ratingHandler(2)}
                        id=""
                        onChange={(e) => {}}
                      />
                      &nbsp;2 & above
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="rating"
                        checked={ratings === 3}
                        onClick={() => ratingHandler(3)}
                        id=""
                        onChange={(e) => {}}
                      />
                      &nbsp;3 & above
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="rating"
                        checked={ratings === 4}
                        onClick={() => ratingHandler(4)}
                        id=""
                        onChange={(e) => {}}
                      />
                      &nbsp;4 & above
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="rating"
                        checked={ratings === 5}
                        onClick={() => ratingHandler(5)}
                        id=""
                        onChange={(e) => {}}
                      />
                      &nbsp;5 & above
                    </li>
                  </ul>
                </div>
              </div>
              <div className="productsPage">
                <h1>
                  {keyWord
                    ? <p className="searchingResult">Showing ,  {count} results for <span>"{keyWord}"</span></p>
                    : <p> PRODUCTS  </p>}
                </h1>
                <div className="products">
                <a onClick={scrollToFilters} href="#addFiltersHere" className="addFilters" >ADD FILTERS <i className="fa-solid fa-arrow-down-wide-short"></i>
                
                </a>
                  {products &&
                    products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                {resultPerPage < count && (
                  
                  <div className="paginationBox">
                    <p
                      style={{
                        fontFamily: "var(--font2)",
                        padding: "0 45px",
                        textAlign: "left",
                      }}
                    >
                      Page {currentPage} of {Math.ceil(count / resultPerPage)}
                    </p>
                    <Pagination
                      className="pgn"
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={productsCount}
                      onChange={setCurrentPageNo}
                      nextPageText="NEXT"
                      prevPageText="PREVIOUS"
                      // firstPageText="1st"
                      // lastPageText="Last"
                      itemclassName="page-item"
                      linkclassName="page-link"
                      activeclassName="pageItemActive"
                      activeLinkclassName="pageLinkActive"
                    />
                    <div>
                      
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
            </>
            
            }
          </div>
        </>
      )}
    </>
  );
};

export default Products;
