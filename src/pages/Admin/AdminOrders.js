import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Button, Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

function AdminOrders() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    } //成功刪除 改變successDelete 重跑一次useEffect 更新資料 並重置刪除狀態
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm("確定要刪除嗎?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`http://localhost:5000/api/orders/${order._id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "DELETE_SUCCESS" });
        toast.success("刪除成功");
      } catch (err) {
        dispatch({ type: "DELETE_FAIL" });
        toast.error("刪除失敗");
      }
    }
  };

  return (
    <>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        "發生錯誤"
      ) : (
        <Container className="mt-5">
          <Helmet>訂單管理</Helmet>
          <h3 className="my-3">訂單管理</h3>{" "}
          <table className="table table-dark text-center">
            <thead>
              <tr>
                <th>訂單編號</th>
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
                  <td>
                    <Link to={`/orderpage/${order._id}`}>{order._id}</Link>
                  </td>
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
                      className="mx-1"
                      type="button"
                      variant="success"
                      onClick={() => {
                        navigate(`/orderpage/${order._id}`);
                      }}
                    >
                      訂單明細
                    </Button>
                    <Button
                      onClick={() => deleteHandler(order)}
                      className="mx-1"
                      type="button"
                      variant="danger"
                    >
                      刪除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      )}
    </>
  );
}

export default AdminOrders;
