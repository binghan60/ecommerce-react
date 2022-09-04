import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${item._id}`
    );
    // if (data.countInStock < quantity) {
    //   window.alert("商品無庫存");
    //   return;
    // }
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
    navigate("/singin?redirect=/shipping");
  };
  return (
    <>
      <Helmet>
        <title className="text-center">購物車</title>
      </Helmet>
      <h3>燒肉屋 | 購物車</h3>
      <Row>
        {cartItems.length === 0 ? (
          <Col md={12}>
            <Link className="text-decoration-none" to={"/productList"}>
              <h5 className="text-center">尚未選購商品，點擊前往購物</h5>
            </Link>
          </Col>
        ) : (
          <>
            <Col md={8}>
              <ListGroup>
                {cartItems.map((item) => {
                  return (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={3}>
                          <img
                            className="w-100"
                            src={`/imgs/${item.img}`}
                            alt={item.name}
                          ></img>
                        </Col>
                        <Col md={3}>
                          <Link className="text-decoration-none" to={`/ProductList/${item.slug}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col className="text-center" md={2}>
                          <Button
                            onClick={() =>
                              updateCartHandler(item, item.quantity - 1)
                            }
                            variant="light"
                            disabled={item.quantity === 1}
                          >
                            <i className="fa-sharp fa-solid fa-minus"></i>
                          </Button>
                          <span> {item.quantity} </span>
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
                        <Col className="text-center" md={2}>
                          ${item.price}
                        </Col>
                        <Col className="text-center" md={2}>
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
                      <h4>
                        總計
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
                      </h4>
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
        )}
      </Row>
    </>
  );
}

export default CartPage;
