import { Col, Row } from "react-bootstrap";

function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? "active" : ""}>登入</Col>
      <Col className={props.step2 ? "active" : ""}>訂購資訊</Col>
      <Col className={props.step3 ? "active" : ""}>付款方式</Col>
      <Col className={props.step4 ? "active" : ""}>成功訂購</Col>
    </Row>
  );
}
export default CheckoutSteps;
