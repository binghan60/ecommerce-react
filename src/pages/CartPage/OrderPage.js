import { useContext, useReducer, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../components/LoadingBox";
import { Store } from "../../Store";
import axios from "axios";
import { Card, Col, Row, ListGroup, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return { ...state, loadingDeliver: false, successDeliver: false };
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
  //訂單資料用order接住
  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    order: {},
    successPay: false,
    loadingPay: false,
  });
  function createOrder(data, actions) {
    return (
      actions.order
        .create({
          //建立訂單 paypal支付的金額 為訂單總金額
          purchase_units: [{ amount: { value: order.totalPrice } }],
        })
        //成功create order paypal回傳訂單ID
        .then((orderID) => {
          return orderID;
        })
    );
  }
  //付款成功後更新資料庫狀態
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `http://localhost:5000/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("付款成功");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: "付款失敗" });
        toast.error("付款失敗,請稍後再試");
      }
    });
  }

  function onError(err) {
    toast.error("付款發生錯誤");
  }

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

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
    //沒有訂單資料 抓訂單 或已付款 則抓資料更新狀態
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      //如果付款成功表示 付款流程已經結束 動態監控的狀態重置 Ex.付款中、成功付款
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      //否則開始載入paypalscript 設定
      const loadPayPalScript = async () => {
        //抓paypal clientID
        const { data: clientId } = await axios.get(
          "http://localhost:5000/api/keys/paypal",
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        //重置設定 設定clientId 跟幣別
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": clientId, currency: "TWD" },
        });
        //設定狀態為待辦
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPayPalScript();
    }
  }, [
    order,
    orderId,
    userInfo,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverFinishHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `http://localhost:5000/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("配送成功");
    } catch (err) {
      toast.error("配送失敗");
      dispatch({ type: "DELIVER_FAIL" });
    }
  }
  return (
    <>
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
          <div className="text-black">
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
                    <strong>配送狀態：</strong>
                    {order.isDeliverd ? (
                      <span variant="success">已於{order.deliveredAt}送達</span>
                    ) : (
                      <span variant="danger">尚未送達</span>
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
                      <p>已於{order.paidAt.substring(0, 10)}付款</p>
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
                      {/* 還沒付款才會出現 */}
                      {!order.isPaid && (
                        <ListGroup.Item>
                          {isPending ? (
                            <LoadingBox></LoadingBox>
                          ) : (
                            <div>
                              <PayPalButtons
                                //點擊按鈕時
                                createOrder={createOrder}
                                //成功付款時更新狀態
                                onApprove={onApprove}
                                //付款出現錯誤時
                                onError={onError}
                              ></PayPalButtons>
                            </div>
                          )}
                          {loadingPay && <LoadingBox></LoadingBox>}
                        </ListGroup.Item>
                      )}
                      {/* 管理者  已付款  尚未送達 */}
                      {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                          {loadingDeliver && <LoadingBox></LoadingBox>}
                          <div className="d-grid">
                            <Button
                              type="button"
                              onClick={deliverFinishHandler}
                            >
                              完成配送
                            </Button>
                          </div>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}

export default OrderPage;
