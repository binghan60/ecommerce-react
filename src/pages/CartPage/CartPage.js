import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { Helmet } from "react-helmet-async";
import { Button, Card, ListGroup, Row, Col, Container } from "react-bootstrap";
import CheckoutSteps from "./components/CheckoutSteps";

function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = (item, quantity) => {
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
  };
  const checkoutHandler = () => {
    navigate("/signin?redirect=/shippingaddress");
  };
  return (
    <>
      {cartItems.length === 0 ? (
        <div>
          <h5 className="text-center fs-2 bingCart">
            <Link to={"/productList"}>尚未選購商品，點擊前往購物 </Link>
          </h5>
        </div>
      ) : (
        <Container>
          <Row>
            <>
              <CheckoutSteps step1></CheckoutSteps>
              <Helmet>
                <title className="text-center">購物車</title>
              </Helmet>
              <h3 className="my-3">燒肉屋 | 購物車</h3>
              <Col md={8} className="mb-2">
                <ListGroup>
                  {cartItems.map((item) => {
                    return (
                      <ListGroup.Item key={item.slug}>
                        <Row className="align-items-center">
                          <Col md={2}>
                            <img
                              className="w-100"
                              src={
                                item.image && item.image.length > 20
                                  ? item.image
                                  : `/imgs/${item.image}`
                              }
                              alt={item.name}
                            ></img>
                          </Col>
                          <Col md={4} className="fs-5">
                            <Link to={`/ProductList/${item.slug}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col xs={6} md={3} className="text-center">
                            {/* 購物車-1 */}
                            <Button
                              onClick={() =>
                                updateCartHandler(item, item.quantity - 1)
                              }
                              variant="light"
                              disabled={item.quantity === 1}
                            >
                              <i className="fa-sharp fa-solid fa-minus"></i>
                            </Button>
                            <span>　{item.quantity}　</span>
                            {/* 購物車-1 */}
                            <Button
                              onClick={() =>
                                updateCartHandler(item, item.quantity + 1)
                              }
                              variant="light"
                              disabled={item.quantity === item.countInStock}
                            >
                              <i className="fa-sharp fa-solid fa-plus"></i>
                            </Button>
                          </Col>
                          <Col xs={3} md={2} className="text-center">
                            ${item.price}
                          </Col>
                          <Col xs={3} md={1} className="text-center">
                            <Button
                              onClick={() => removeItemHandler(item)}
                              variant="light"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <ListGroup variant="black">
                      <ListGroup.Item>
                        <h4>總計</h4>
                        {cartItems.reduce((a, c) => a + c.quantity, 0)}
                        件商品：
                        <p>
                          總計$
                          {cartItems.reduce(
                            (a, c) => a + c.price * c.quantity,
                            0
                          )}
                          元
                        </p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-grid">
                          <Button
                            onClick={checkoutHandler}
                            type="button"
                            variant="secondary"
                          >
                            立即結帳
                          </Button>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </>
          </Row>
        </Container>
      )}
    </>
  );
}

export default CartPage;
