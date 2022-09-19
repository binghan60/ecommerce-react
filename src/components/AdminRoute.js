import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store";

function AdminRoute(props) {
  const { children } = props;
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />; //有登入且是管理員才顯示內容 否則跳轉登入頁
}

export default AdminRoute;
