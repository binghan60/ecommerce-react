import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "./components/CheckoutSteps";
import { Store } from "../../Store";
import { countries, postcodes, townships } from "./data/townships";

function ShippingAddress() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  // 代表目前被選中的縣市的索引值
  // 注意資料類型都是數字(索引值是數字)
  // -1代表目前沒有選中任何的陣列中的值
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [countryIndex, setCountryIndex] = useState(
    shippingAddress.countryIndex === 0 ? 0 : shippingAddress.countryIndex || -1
  );
  const [township, setTownship] = useState(shippingAddress.township || "");
  const [townshipIndex, setTownshipIndex] = useState(
    shippingAddress.townshipIndex || -1
  );

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        country,
        countryIndex,
        township,
        townshipIndex,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        country,
        countryIndex,
        township,
        townshipIndex,
      })
    );
    navigate("/paymentmethod");
  };

  useEffect(() => {
    //沒有用戶資訊跳轉(帶query string)登入頁
    if (!userInfo) {
      navigate("/signin?redirect=/shippingaddress");
    }
  }, [userInfo, navigate]);

  return (
    <>
      <CheckoutSteps step1 step2 />
      <Container className="w-50">
        <Helmet>
          <title>訂購資訊</title>
        </Helmet>
        <h3 className="my-3">訂購資訊</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>
              <h4>姓名</h4>
            </Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          {/* <h4>
            郵遞區號：
            {countryIndex > -1 &&
              townshipIndex > -1 &&
              postcodes[countryIndex][townshipIndex]}
          </h4> */}
          <Form.Group>
            <Form.Label>
              <h4>地址</h4>
            </Form.Label>
            <div className="d-flex mb-4">
              <Form.Select
                value={countryIndex}
                onChange={(e) => {
                  // e.target.value為字串類型(由網頁上傳入都是字串值)
                  // 為了保持countryIndex(state狀態)的資料類型都一致相同，所以要轉為數字
                  setCountryIndex(Number(e.target.value));
                  // 重置townshipIndex的值為-1
                  setTownshipIndex(-1);
                  setCountry(countries[e.target.value]);
                  setTownship("");
                }}
              >
                <option value="-1">請選擇縣市</option>
                {countries.map((v, i) => {
                  return (
                    <option key={i} value={i}>
                      {v}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Select
                value={townshipIndex}
                onChange={(e) => {
                  // e.target.value為字串類型(由網頁上傳入都是字串值)
                  // 為了保持setTownshipIndex(state狀態)的資料類型都一致相同，所以要轉為數字
                  setTownshipIndex(Number(e.target.value));
                  setTownship(townships[countryIndex][e.target.value]);
                }}
              >
                <option value="-1">請選擇區域</option>
                {/* 當有選擇縣市(countryIndex >)時才要作map，呈現其它的區域選項 */}
                {countryIndex > -1 &&
                  townships[countryIndex].map((v, i) => {
                    return (
                      <option key={i} value={i}>
                        {v}
                      </option>
                    );
                  })}
              </Form.Select>
            </div>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <div className="text-center my-4">
            <Button variant="primary" type="submit">
              下一步
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default ShippingAddress;
