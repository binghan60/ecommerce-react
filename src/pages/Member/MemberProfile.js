import axios from "axios";
import { useState, useReducer, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
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

function MemberProfile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  console.log(userInfo.email);
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("密碼確認需相同");
      return;
    }
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name,
          email,
          password,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      //修改成功 更新狀態跟localStorage
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("修改成功");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: "修改失敗" });
      toast.error("資料修改失敗");
    }
  };

  return (
    <>
      <Helmet>
        <title className="text-center">會員資料</title>
      </Helmet>
      <div className="container w-50">
        <h3>會員資料</h3>

        <form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>姓名</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>電子信箱</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>密碼</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>確認密碼</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
          </Form.Group>
          <div className="text-center">
            <Button type="submit">確認修改</Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MemberProfile;
