import { useContext } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavDropdown, Badge, Container } from "react-bootstrap";
import { Store } from "../Store";

function NavbarComponent() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const logoutHandler = () => {
    ctxDispatch({ type: "USER_LOGOUT" });
  };

  return (
    <>
      <Navbar className="mb-5">
        <Container>
          <Link to={"/"}>首頁</Link>
          <Link to={"/productList"}>購物商城</Link>
          <Link to={"/reserve"}>立即訂位</Link>
          <Link to={"/cartpage"}>
            購物車
            {cart.cartItems.length > 0 && (
              <Badge pill bg="danger">
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              </Badge>
            )}
          </Link>
          {userInfo ? (
            <NavDropdown
              menuVariant="dark"
              title=<span style={{ color: "#fff" }}>{userInfo.name}</span>
            >
              <NavDropdown.Item>
                <Link to={"/profile"}>會員中心</Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to={"/orderhistory"}>歷史訂單</Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutHandler}>
                <Link to={"#logout"}>登出</Link>
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Link to={"/signin"}>會員登入</Link>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
