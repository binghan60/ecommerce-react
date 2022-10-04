import { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "./components/CheckoutSteps";
import { toast } from "react-toastify";
import { Store } from "../../Store";
import axios from "axios";
import LoadingBox from "../../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREAT_REQUEST":
      return { ...state, loading: true };

    case "CREAT_SUCCESS":
      return { ...state, loading: false };
    case "CREAT_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

function PlaceOrder() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  //總金額
  cart.itemsPrice = cart.cartItems.reduce(
    (a, c) => a + c.quantity * c.price,
    0
  );
  //運費
  cart.shippingPrice = cart.itemsPrice >= 1000 ? 0 : 60;
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREAT_REQUEST" });
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREAT_SUCCESS" });
      navigate(`/orderpage/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREAT_FAIL" });
      toast.error("暫時無法完成結帳，請稍後再試");
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/paymentmethod");
    }
  }, [cart, navigate]);
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <h3 className="my-3">訂單資訊確認</h3>
      <Container className="text-black">
        <Helmet>訂單資訊確認</Helmet>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>基本資料</Card.Title>
                <Card.Text className="mt-3">
                  <strong>姓名：</strong>
                  {cart.shippingAddress.fullName}
                  <br />
                  <strong>地址：</strong>
                  {cart.shippingAddress.country}
                  {cart.shippingAddress.township}
                  {cart.shippingAddress.address}
                </Card.Text>
                <Link
                  style={{ fontSize: "1.15rem", fontWeight: "600" }}
                  to={"/shippingaddress"}
                >
                  編輯
                </Link>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>付款方式</Card.Title>
                <Card.Text className="mt-3">
                  <strong>付款方式：</strong>
                  {cart.paymentMethod}
                </Card.Text>
                <Link
                  style={{ fontSize: "1.15rem", fontWeight: "600" }}
                  to={"/paymentmethod"}
                >
                  編輯
                </Link>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>結帳商品</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <img
                            className="w-100 rounded"
                            src={
                              item.image && item.image.length > 20
                                ? item.image
                                : `/imgs/${item.image}`
                            }
                            alt={item.name}
                          />
                        </Col>
                        <Col md={4} className="text-center">
                          <Link to={`/productlist/${item.slug}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={3} className="text-center">
                          <span>{item.quantity} 件</span>
                        </Col>
                        <Col md={3} className="text-center">
                          共 {item.price} 元
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="mt-2">
                  <Link
                    style={{ fontSize: "1.15rem", fontWeight: "600" }}
                    to={"/cartpage"}
                  >
                    編輯
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <img
              className="w-100"
              src="/imgs/1000_free_shipping.png"
              alt=""
            ></img>
            <Card>
              <Card.Body>
                <Card.Title>訂單總計</Card.Title>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>商品</Col>
                      <Col>${cart.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>運費</Col>
                      <Col>${cart.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>總金額</strong>
                      </Col>
                      <Col>
                        <strong>${cart.totalPrice}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="text-center">
                      <Button
                        type="submit"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        完成訂單
                      </Button>
                    </div>
                    {loading && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PlaceOrder;
