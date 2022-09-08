import { useState, useContext, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Store } from "../../Store";
import { toast, Toast } from "react-toastify";

function SignIn() {
  const navigate = useNavigate();
  const { search } = useLocation();
  //search是整串query string
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  //redirectInUrl是query string裡的redirect=值
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log("search", search);
  console.log("redirectInUrl", redirectInUrl);
  //登入 送出表單
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/users/singin`,
        { email, password }
      );
      ctxDispatch({ type: "USER_SINGIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      //如果redirect不存在 回首頁
      navigate(redirect || "/");
    } catch (err) {
      toast.error("帳號密碼錯誤");
    }
  };
  //登入狀態直接打/singin跳轉首頁
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="w-50">
      <Helmet>
        <title>登入</title>
      </Helmet>
      <Form className="mt-5" onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>
            <h3>Email</h3>
          </Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h3>Password</h3>
          </Form.Label>
          <Form.Control
            type="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div className="text-center my-3">
          <Button type="submit">Sing In</Button>
        </div>
        <div className="text-center">
          還沒有帳號嗎?
          <Link to={`/signup?redirect=${redirect}`}>快註冊一個吧</Link>
        </div>
        <div className="text-center mt-4">
          <Link to={"/dashboard"}>管理者登入</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignIn;
