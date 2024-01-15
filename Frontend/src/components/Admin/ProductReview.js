import React, { useEffect,useState } from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductReview.css";
import { useSelector, useDispatch } from "react-redux";
import {
    clearErrors,
    getAllReviews,
    deleteReviews,
} from "../../actions/productActions";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";
import {  DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
  );

  const { error, reviews, loading } = useSelector(
    (state) => state.productReviews
  );

  const [productId, setProductId] = useState("");

  // const deleteReviewHandler = (reviewId) => {
  //   dispatch(deleteReviews(reviewId, productId));
  // };

  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteReviewHandler = (reviewId) => {
    setDeleteReviewId(reviewId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    dispatch(deleteReviews(deleteReviewId, productId));
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCanceled = () => {
    setDeleteReviewId(null);
    setIsDeleteDialogOpen(false);
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  useEffect(() => {
    // if (productId.length < 24 || productId.length > 24) {
    //   return alert.error("Invalid Product ID")
    // }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate("/Admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    dispatch(getAllReviews(productId));

    }
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, productId]);

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 100,
      sortable: false,
      flex: 0.8,
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 200,
      flex: 1,
      sortable: false,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 10,
      flex: 0.5,
      sortable: false,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "actions",
      flex: 0.4,
      headerName: "Actions",
      minWidth: 100,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
        
            <div className="productActions">
              <Button
                onClick={() =>
                    deleteReviewHandler(params.getValue(params.id, "id"))
                }
              >
                <DeleteIcon />
              </Button>
              <Dialog
            open={isDeleteDialogOpen}
            onClose={handleDeleteCanceled}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            }}
            BackdropProps={{
              style: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <DialogTitle id="alert-dialog-title">{"Delete Confirmation"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this review?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCanceled} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
            </div>
          </>
        );
      },
    },
  ];
  const rows = [];
  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        user: item.name,
        comment: item.comment,
      });
    });
  return (
    <>
       <MetaData
            title={
              "Reviews | eCart.com"
            }
        />
      <div className="dashboardAdmin">
        <Sidebar />
        <div className="allProducts">
          <form
            className="productReviewsForm "
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL &nbsp; REVIEWS</h1>
            <div>
              <Star />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="ProductReviewBtn"
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
              style={{marginTop:"35px"}}
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReview;
