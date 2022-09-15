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
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto  w-100  justify-content-end">
              <Link className="nav-link" to={"/productList"}>
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
              {userInfo ? (
                <NavDropdown
                  id="basic-nav-dropdown"
                  menuVariant="dark"
                  title=<span>{userInfo.name}</span>
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
