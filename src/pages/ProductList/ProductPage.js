import { useState, useEffect, useContext, useReducer } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  ListGroup,
  Badge,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Rating from "./components/Rating";
import { Store } from "../../Store";
import axios from "axios";
import LoadingBox from "../../components/LoadingBox";
import { useRef } from "react";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "REFRESH_PRODUCT":
      return { ...state, products: action.payload };
    default:
      return state;
  }
};

function ProductPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const ratingRef = useRef();
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();
  const [{ loading, error, products, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      products: [],
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `http://localhost:5000/api/products/slug/${slug}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });//product在此設定的
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "取得商品資料失敗" });
      }
    };

    fetchData();
  }, [slug]);

  if (products.message === "找不到該產品") {
    navigate("/productlist", { replace: true });
  }
  // 每改變數量都發req給後端確認庫存
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === products._id);
    //假如在車內 商品+1
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${products._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("商品庫存不足");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...products, quantity },
    });
  };
  const submitHandler = async (e) => {
    //評論功能
    e.preventDefault();
    if (!rating) {//不給評價跳提示
      toast.error("請選擇評分和留言");
    }

    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        `http://localhost:5000/api/products/${products._id}/reviews`,
        { rating, comment, name: userInfo.name }, //送資料去後端
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("評論成功");
      products.reviews.unshift(data.review); //發表時顯示在最前面 只是本頁的狀態
      products.numReviews = data.numReviews;//data後端傳來的狀態 更新商品狀態
      products.rating = data.rating;
      setRating(0);
      setComment("");
      dispatch({ type: "REFRESH_PRODUCT", payload: products });
      window.scrollTo({
        behavior: "smooth",
        top: ratingRef.current.offsetTop,
      });
    } catch (err) {
      toast.error("評論失敗");
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  //產品內頁
  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        "發生錯誤"
      ) : (
        <Row>
          {/* 網頁標題 */}
          <Helmet>
            <title className="text-center">{products.name}</title>
          </Helmet>
          <Col sm={12} md={5} lg={5}>
            <img
              className="w-100 h-100"
              src={
                products.image && products.image.length > 20
                  ? products.image
                  : `/imgs/${products.image}`
              }
              alt={products.name}
            />
          </Col>
          <Col sm={12} md={7} lg={7}>
            <ListGroup style={{ height: "100%" }}>
              <ListGroup.Item className="fs-5 pt-4">
                <p>{products.name}</p>
              </ListGroup.Item>
              <ListGroup.Item className="fs-5 pt-3">
                <p>評價：</p>
                <Rating
                  rating={products.rating}
                  numReviews={products.numReviews}
                ></Rating>
              </ListGroup.Item>
              <ListGroup.Item className="flex-grow-1">
                <p className="fs-5 pt-2">商品描述：</p>
                <p className="fs-6">{products.description}</p>
              </ListGroup.Item>
              <ListGroup.Item className="pt-3">
                <p className="fs-5">
                  商品狀態：
                  {products.countInStock > 0 ? (
                    <Badge bg="success">庫存充足</Badge>
                  ) : (
                    <Badge bg="danger">售完</Badge>
                  )}
                </p>
              </ListGroup.Item>
              <ListGroup.Item className="pt-3">
                <p className="fs-5">價格：</p>

                <p className="text-center fs-5">{products.price}元</p>
              </ListGroup.Item>
              {products.countInStock > 0 ? (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      className="fs-5"
                      onClick={addToCartHandler}
                      variant="success"
                    >
                      加入購物車
                    </Button>
                  </div>
                </ListGroup.Item>
              ) : (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button variant="danger" disabled>
                      商品補貨中
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>

          <div className="text-center">
            <Link to={"/productlist"}>
              <button className="btn btn-light my-5 fs-5">回商品列表</button>
            </Link>
          </div>
          <div className="">
            <h5 ref={ratingRef}>商品討論版</h5>
            <div className="">
              {products.reviews.length === 0 && (
                <p>這件商品還沒有評價唷!! 快來分享心得吧</p>
              )}
            </div>
            <ListGroup>
              {products.reviews.map((review, i) => (
                <ListGroup.Item key={review._id}>
                  <strong className="fs-5">{review.name}</strong>
                  <Rating rating={review.rating} ratingTitle={" "}></Rating>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="my-3">
              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <h5>發佈留言</h5>
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>評分</Form.Label>

                    <Form.Select
                      className="mb-3"
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">---請選擇---</option>
                      <option value="5">5星-非常好</option>
                      <option value="4">4星-很好</option>
                      <option value="3">3星-普通</option>
                      <option value="2">2星-不滿意</option>
                      <option value="1">1星-差強人意</option>
                    </Form.Select>

                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Comments"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: "100px" }}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </FloatingLabel>
                    <div className="mb-3 text-center">
                      <Button disabled={loadingCreateReview} type="submit">
                        送出
                      </Button>
                    </div>
                  </Form.Group>
                </form>
              ) : (
                <Link to={`/signin?redirect=/productlist/${products.slug}`}>
                  請先登入會員才能分享
                </Link>
              )}
            </div>
          </div>
        </Row>
      )}
    </>
  );
}

export default ProductPage;
