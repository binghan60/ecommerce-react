import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import CheckoutSteps from "./components/CheckoutSteps";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "Paypal"
  );

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethodName));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <h3 className="my-3">付款方式</h3>
      <Container className="w-50">
        <Helmet>付款方式</Helmet>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <img className="w-100" src="/imgs/paypal.png" alt=""></img>
              <Form.Check
                type="radio"
                id="Paypal"
                label="Paypal"
                value="Paypal"
                checked={paymentMethodName === "Paypal"}
                onChange={(e) => setPaymentMethodName(e.target.value)}
              ></Form.Check>
            </Col>
            <Col md={6}>
              <img
                className="w-100"
                src="/imgs/linepay-logo-tw.png"
                alt=""
              ></img>
              <Form.Check
                type="radio"
                id="LinePay"
                label="LinePay"
                value="LinePay"
                checked={paymentMethodName === "LinePay"}
                onChange={(e) => setPaymentMethodName(e.target.value)}
              ></Form.Check>
            </Col>
          </Row>

          <div className="text-center">
            <Button type="submit">下一步</Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default PaymentMethod;
