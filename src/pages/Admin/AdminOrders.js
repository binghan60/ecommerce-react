import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../../components/LoadingBox";
import { Store } from "../../Store";

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

function AdminOrders() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true, //初始載入  失敗或成功都會變false
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`http://localhost:5000/api/orders/`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "取得訂單列表失敗" });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <Helmet>訂單管理</Helmet>
      <h3>訂單管理</h3>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        "發生錯誤"
      ) : (
        <table className="table table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>用戶</th>
              <th>日期</th>
              <th>金額</th>
              <th>付款狀態</th>
              <th>配送狀態</th>
              <th>功能</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : "已刪除用戶"}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? order.paidAt.substring(0, 10) : "未付款"}
                </td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "未送達"}
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
    </>
  );
}

export default AdminOrders;
