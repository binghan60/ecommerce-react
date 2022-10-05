import { useContext } from "react";
import { Store } from "../../../Store";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import Rating from "./Rating";

function ProductCard(props) {
  const { ProductData } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === ProductData._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("商品庫存不足");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  return (
    <div className="h-100 d-flex flex-column ">
      <Link to={`/productList/${ProductData.slug}`}>
        <img
          className="w-100 pb-3"
          src={
            //長度超過20就用雲端
            ProductData.image.length > 20
              ? ProductData.image
              : `/imgs/${ProductData.image}`
          }
          alt=""
        />
      </Link>
      <h6 className="flex-grow-1 text-break fs-5">{ProductData.name}</h6>
      <Rating
        rating={ProductData.rating}
        numReviews={ProductData.numReviews}
      ></Rating>
      <div>
        <strong>{ProductData.price}元</strong>
        <span className="float-end">尚有{ProductData.countInStock}份</span>
      </div>
      <div className="text-center">
        {ProductData.countInStock === 0 ? (
          <Button className="fs-5" variant="danger" disabled>
            商品補貨中
          </Button>
        ) : (
          <Button
            className="fs-5"
            onClick={() => addToCartHandler(ProductData)}
            variant="success"
          >
            加入購物車
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
