import { useContext } from "react";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { Store } from "../Store";

function Navbar() {
  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <>
      <nav className="mb-5">
        <ul className="d-flex justify-content-between container">
          <li>
            <Link className="text-decoration-none" to={"/"}>
              首頁
            </Link>
          </li>
          <li>
            <Link className="text-decoration-none" to={"/ProductList"}>
              產品列表
            </Link>
          </li>
          <li>
            <Link className="text-decoration-none" to={"/reserve"}>
              立即訂位
            </Link>
          </li>
          <li>
            <Link className="text-decoration-none" to={"/member"}>
              會員登入
            </Link>
          </li>
          <li>
            <Link className="text-decoration-none" to={"/cartpage"}>
              購物車
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
          </li>
          <li>
            <Link className="text-decoration-none" to={"/dashboard"}>
              管理者登入
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
