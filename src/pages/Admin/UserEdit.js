import axios from "axios";
import { useState, useContext, useReducer, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function UserEdit() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", paylaod: "取得列表失敗" });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });

      if (userInfo._id === data.user._id) {
        //如果管理者修改自己的資料 會更新store 跟localstorage
        ctxDispatch({ type: "USER_SIGNIN", payload: data.user });
        localStorage.setItem("userInfo", JSON.stringify(data.user));
      }
      toast.success("修改成功");
      navigate("/admin/adminusers");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error("修改失敗");
    }
  };
  return (
    <>
      <Container className="w-50">
        <Helmet>
          <title>修改會員{userId}資料</title>
        </Helmet>
        <h3>會員編號{userId}</h3>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          "發生錯誤"
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-2" controlId="name">
              <Form.Label>用戶名稱</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="email">
              <Form.Label>電子信箱</Form.Label>
              <Form.Control
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Check
              className="mb-2"
              type="checkbox"
              id="isAdmin"
              label="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>

            <div className="my-4 text-center">
              <Button disabled={loadingUpdate} type="submit">
                送出修改
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
          </Form>
        )}
      </Container>
    </>
  );
}

export default UserEdit;
