import axios from "axios";
import { useEffect, useContext, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Store } from "../../Store";
import LoadingBox from "../../components/LoadingBox";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
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

function AdminUsers() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("http://localhost:5000/api/users", {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "取得列表失敗" });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm("確定要刪除嗎?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`http://localhost:5000/api/users/${user._id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "DELETE_SUCCESS" });
        toast.success("刪除成功");
      } catch (err) {
        dispatch({ type: "DELETE_FAIL" });
        toast.error(err.response.data.message); //後端回傳的message
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
          <Helmet>用戶管理</Helmet>
          <h3 className="my-3">用戶管理</h3>
          <table className="table table-dark text-center">
            <thead>
              <tr>
                <td>用戶編號</td>
                <td>名稱</td>
                <td>電子信箱</td>
                <td>管理者</td>
                <td>建立日期</td>
                <td>功能</td>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "是" : "否"}</td>
                  <td>{user.createdAt.substring(0, 10)}</td>
                  <td>
                    <Button
                      className="mx-1"
                      type="button"
                      variant="success"
                      onClick={() => navigate(`/admin/adminusers/${user._id}`)}
                    >
                      修改
                    </Button>
                    <Button
                      className="mx-1"
                      type="button"
                      variant="danger"
                      onClick={() => deleteHandler(user)}
                      disabled={userInfo._id === user._id} //不可刪除自己
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

export default AdminUsers;
