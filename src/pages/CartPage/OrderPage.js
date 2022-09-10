import { useContext, useReducer, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../components/LoadingBox";
import { Store } from "../../Store";
import axios from "axios";
import { Card, Col, Row, ListGroup } from "react-bootstrap";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const params = useParams();
  //網址列ID重新命名orderId
  const { id: orderId } = params;
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "取得訂單資訊失敗" });
      }
    };
    if (!userInfo) {
      return navigate("/signin");
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId, userInfo, navigate]);

  return (
    <>
      {console.log("ordder_ID", order._id)}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        "錯誤"
      ) : (
        <>
          <Helmet>
            <title className="text-center">訂單編號：{orderId}</title>
          </Helmet>
          <h3>訂單編號：{orderId}</h3>
          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>訂購資訊</Card.Title>
                  <Card.Text>
                    <strong>姓名：</strong>
                    {order.shippingAddress.fullName}
                    <br />
                    <strong>地址：</strong>
                    {order.shippingAddress.country}
                    {order.shippingAddress.township}
                    {order.shippingAddress.address}
                  </Card.Text>
                  {order.isDeliverd ? (
                    <p variant="success">已於{order.deliveredAt}送達</p>
                  ) : (
                    <p variant="danger">尚未送達</p>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>付款資訊</Card.Title>
                  <Card.Text>
                    <strong>付款方式：</strong>
                    {order.paymentMethod}
                  </Card.Text>
                  {order.isPaid ? (
                    <p>付款日期：{order.paidAt}</p>
                  ) : (
                    <p variant="danger">尚未付款</p>
                  )}
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>購買商品</Card.Title>
                  <ListGroup variant="flush">
                    {order.orderItems.map((item) => {
                      return (
                        <ListGroup.Item key={item._id}>
                          <Row className="align-items-center">
                            <Col md={6}>
                              <img
                                className="w-50"
                                src={`/imgs/${item.image}`}
                                alt={item.name}
                              ></img>
                              <Link to={`/productlist/${item.slug}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={3}>
                              <span>{item.quantity}</span>
                            </Col>
                            <Col md={3}>${item.price}</Col>
                          </Row>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>訂單總計</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>商品</Col>
                        <Col>${order.itemsPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>運費</Col>
                        <Col>${order.shippingPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>總計</Col>
                        <Col>${order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default OrderPage;
