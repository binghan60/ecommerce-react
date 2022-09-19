import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store";

function ProtectedRoute(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { children } = props;
  return userInfo ? children : <Navigate to="/signin" />; //有登入才顯示內容 否則跳轉登入頁
}

export default ProtectedRoute;
