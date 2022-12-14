import { Col, Row } from "react-bootstrap";

function CheckoutSteps(props) {
  //上層有傳step1  props.step1會變true
  return (
    <Row className="checkout-steps text-center">
      <Col className={props.step1 ? "active fs-6" : "fs-6"}>購物車</Col>
      <Col className={props.step2 ? "active fs-6" : "fs-6"}>訂購資訊</Col>
      <Col className={props.step3 ? "active fs-6" : "fs-6"}>付款方式</Col>
      <Col className={props.step4 ? "active fs-6" : "fs-6"}>訂單資訊確認</Col>
    </Row>
  );
}
export default CheckoutSteps;
