import { useContext, useEffect } from "react";
import { Store } from "../../Store";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../components/LoadingBox";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";
import axios from "axios";
import { Button, Container } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function OrderHistory() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/mine",
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "取得訂單失敗" });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Container>
      <Helmet>
        <title>歷史訂單</title>
      </Helmet>
      <h3 className="my-3">歷史訂單</h3>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <p>發生錯誤</p>
      ) : (
        <table className="table table-dark text-center">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>日期</th>
              <th>金額</th>
              <th>付款狀態</th>
              <th>配送資訊</th>
              <th>功能</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? order.paidAt.substring(0, 10) : "待付款"}
                </td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "尚未送達"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/orderpage/${order._id}`);
                    }}
                  >
                    訂單明細
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
}

export default OrderHistory;
