import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav>
        <ul className="d-flex justify-content-between container">
          <li>
            <Link
              className="text-decoration-none"
              to={"/"}
            >
              首頁
            </Link>
          </li>
          <li>
            <Link className="text-decoration-none" to={"/product"}>
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
            <Link className="text-decoration-none" to={"/cart"}>
              購物車
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
