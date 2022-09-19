import { useContext } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavDropdown, Badge, Container } from "react-bootstrap";
import { Store } from "../Store";
import { LinkContainer } from "react-router-bootstrap";

function NavbarComponent() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const logoutHandler = () => {
    ctxDispatch({ type: "USER_LOGOUT" });
  };

  return (
    <>
      <Navbar expand="lg" bg="warning" variant="light">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>MeowMeat</Navbar.Brand>
          </LinkContainer>
          {/* 漢堡 */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto w-100 justify-content-end">
              <Link className="nav-link" to={"/productlist"}>
                購物商城
              </Link>
              <Link className="nav-link" to={"/reserve"}>
                立即訂位
              </Link>
              <Link className="nav-link" to="/cartpage">
                購物車
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  id="basic-nav-dropdown"
                  menuVariant="dark"
                  title="管理功能"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>管理面板</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>商品管理</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>訂單管理</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>用戶管理</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo ? (
                <NavDropdown
                  id="basic-nav-dropdown"
                  menuVariant="dark"
                  title={userInfo.name}
                >
                  <LinkContainer to="/memberprofile">
                    <NavDropdown.Item>修改會員資料</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>歷史訂單</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="#logout"
                    onClick={logoutHandler}
                  >
                    登出
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="nav-link" to="/signin">
                  會員登入
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
