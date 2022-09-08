import { useState, useContext, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import axios from "axios";
//購物車結帳跳轉本頁附帶queryString  用redirectInUrl抓取暫時存放在queryString redirect的/shipping
//從購物車進redirectInUrl就是shipping  直接去登入頁,redirectInUrl沒抓到東西,變數redirect就是"/"
//一般登入沒有redirect 跳轉首頁
//購物車結帳(有redirect=/shipping) 成功就跳轉redirect(/shipping)
function Signin() {
  const navigate = useNavigate();
  const { search } = useLocation();
  //search是整串query string ?redirect=值
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
        `http://localhost:5000/api/users/signin`,
        { email, password }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      //如果redirect不存在 回首頁
      navigate(redirect || "/");
    } catch (err) {
      toast.error("帳號密碼錯誤");
    }
  };
  //登入狀態直接打/signin跳轉首頁
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
            <h4>Email</h4>
          </Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h4>Password</h4>
          </Form.Label>
          <Form.Control
            type="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div className="text-center my-4">
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

export default Signin;
