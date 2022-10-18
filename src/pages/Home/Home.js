import { Col, Container, Row } from "react-bootstrap";
import MyButton from "../../components/MyButton";
import Rating from "../ProductList/components/Rating";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
gsap.registerPlugin(ScrollTrigger);
function Home() {
  const cardRef1 = useRef(null);
  const cardRef2 = useRef(null);
  const cardRef3 = useRef(null);
  const cardRef4 = useRef(null);
  const cardRef5 = useRef(null);
  const cardRef6 = useRef(null);
  // useEffect(() => {
  //   gsap.from(cardRef1.current, {
  //     delay: 0,
  //     opacity: 0,
  //     y: -150,
  //     duration: 1.5,
  //     scrollTrigger: {
  //       trigger: cardRef1.current,
  //       toggleActions: "restart reverse restart none",
  //     },
  //   });
  //   gsap.from(cardRef2.current, {
  //     delay: 0.25,
  //     rotation: -180,
  //     opacity: 0,
  //     y: -150,
  //     duration: 1.5,
  //     scrollTrigger: {
  //       trigger: cardRef1.current,
  //       toggleActions: "restart reverse restart none",
  //     },
  //   });
  //   gsap.from(cardRef3.current, {
  //     delay: 0.5,
  //     opacity: 0,
  //     y: -150,
  //     duration: 1.5,
  //     scrollTrigger: {
  //       trigger: cardRef1.current,
  //       toggleActions: "restart reverse restart none",
  //     },
  //   });
  //   gsap.from(cardRef4.current, {
  //     delay: 0.75,
  //     opacity: 0,
  //     y: -150,
  //     duration: 1.5,
  //     scrollTrigger: {
  //       trigger: cardRef1.current,
  //       toggleActions: "restart reverse restart none",
  //     },
  //   });
  //   gsap.from(cardRef5.current, {
  //     delay: 1,
  //     opacity: 0,
  //     y: -150,
  //     duration: 1.5,
  //     scrollTrigger: {
  //       trigger: cardRef1.current,
  //       toggleActions: "restart reverse restart none",
  //     },
  //   });
  //   gsap.from(cardRef6.current, {
  //     delay: 1.25,
  //     opacity: 0,
  //     y: -150,
  //     duration: 1.5,
  //     scrollTrigger: {
  //       trigger: cardRef1.current,
  //       toggleActions: "restart reverse restart none",
  //     },
  //   });
  // }, []);
  return (
    <>
      <section>
        <div className="home d-flex align-items-center text-center">
          <Container>
            <div>
              <h1 className="fs-1 pb-5">OPEN A FOOD JOURNEY</h1>
              <MyButton text={"BOOK A TABLE"}></MyButton>
            </div>
          </Container>
        </div>
        <Container className="mt-5 mb-5">
          <Row>
            <Col xs={12} md={4}>
              <div className="cardBorder text-center" ref={cardRef1}>
                <h4 className="fs-3">Food</h4>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                  consequuntur, eius omnis nobis ipsam recusandae consectetur
                  aspernatur. Eos esse, temporibus accusamus sequi totam quo
                  laboriosam!
                </p>
                <br></br>
                <MyButton text={"VIEW MORE"}>VIEW MORE</MyButton>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="cardImgWrap" ref={cardRef2}>
                <img
                  className="w-100 h-100"
                  src="/imgs/nHDtjguNzm_small.png"
                  alt=""
                />
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="cardBorder text-center" ref={cardRef3}>
                <h4 className="fs-3">Drink</h4>
                <p className="">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dolorum voluptates aliquid possimus officiis corrupti
                  necessitatibus rem fugit dignissimos, iure quidem voluptas qui
                  excepturi magni! Rem.
                </p>
                <br></br>
                <MyButton text={"VIEW MORE"}>VIEW MORE</MyButton>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="cardImgWrap" ref={cardRef4}>
                <img
                  className="w-100 h-100"
                  src="/imgs/Negroni-recept.jpg"
                  alt=""
                />
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="cardBorder text-center" ref={cardRef5}>
                <h4 className="fs-3">ICE CREAM</h4>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
                  ipsum nemo autem voluptatum fuga exercitationem perspiciatis
                  qui corrupti aliquid sequi dolore facilis harum, iusto dolor.
                </p>
                <br></br>
                <MyButton text={"VIEW MORE"}>VIEW MORE</MyButton>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="cardImgWrap" ref={cardRef6}>
                <img className="w-100 h-100" src="/imgs/abe363eb.jpg" alt="" />
              </div>
            </Col>
          </Row>
        </Container>
        <img
          className="w-100 d-none d-md-block py-5"
          src="/imgs/3766282.jpg"
          alt=""
        />
        <img
          className="w-100 d-block d-md-none"
          src="/imgs/37662821.jpg"
          alt=""
        />
        <Container>
          <div className="text-center mt-5">
            <h3 className="fs-1">SHOP PRODUCTS</h3>
            <img className="shopDecor" src="/imgs/topborder.png" alt="" />
            <Row className="mt-5">
              <Col xs={6} lg={3}>
                <div>
                  <div className="productImg">
                    <img className="w-100 h-100" src="/imgs/10.png" alt="" />
                  </div>
                  <h6 className="mt-3 fs-4">Selected Beef Combo</h6>
                  <div className="text-center">
                    <Rating ratingTitle={" "} rating={4}></Rating>
                  </div>
                  <p className="fs-5 mt-1">$699</p>
                </div>
              </Col>
              <Col xs={6} lg={3}>
                <div>
                  <div className="productImg">
                    <img className="w-100 h-100" src="/imgs/11.png" alt="" />
                  </div>
                  <h6 className="mt-3 fs-4">Spanish Matsusaka Pork</h6>
                  <div className="text-center">
                    <Rating ratingTitle={" "} rating={4}></Rating>
                  </div>
                  <p className="fs-5 mt-1">$599</p>
                </div>
              </Col>
              <Col xs={6} lg={3}>
                <div>
                  <div className="productImg">
                    <img className="w-100 h-100" src="/imgs/12.png" alt="" />
                  </div>
                  <h6 className="mt-3 fs-4">Australian Wagyu Rice</h6>
                  <div className="text-center">
                    <Rating ratingTitle={" "} rating={4}></Rating>
                  </div>
                  <p className="fs-5 mt-1">$299</p>
                </div>
              </Col>
              <Col xs={6} lg={3}>
                <div>
                  <div className="productImg">
                    <img className="w-100 h-100" src="/imgs/13.png" alt="" />
                  </div>
                  <h6 className="mt-3 fs-4">Fruit Ribs</h6>
                  <div className="text-center">
                    <Rating ratingTitle={" "} rating={3}></Rating>
                  </div>
                  <p className="fs-5 mt-1">$199</p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        <Container className="my-5">
          <Row>
            <Col xs={12} lg={6} className="text-center ">
              <div className="cusborder d-flex justify-content-evenly flex-column">
                <h5 className="fs-3">VISIT US</h5>
                <h6 className="fs-5">
                  13 Hanover Place, Mount Vernon,ny, 10552 United States
                </h6>
                <h6 className="fs-5">curvetail@example.com</h6>
                <p className="fs-5">Opening Hours</p>
                <p className="fs-5">Mon - Thu 13:00 ~ 22:00</p>
                <p className="fs-5">Fri - Sun 11:00 ~ 04:00</p>
                <div className="d-flex justify-content-evenly mx-auto w-50 fs-3">
                  <i class="fa-brands fa-facebook-f"></i>
                  <i class="fa-brands fa-instagram"></i>
                  <i class="fa-brands fa-twitter"></i>
                </div>
              </div>
            </Col>
            <Col xs={12} lg={6}>
              <img className="w-100 h-100" src="/imgs/fire.jpg" alt="" />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
