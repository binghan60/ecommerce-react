import { useContext, useReducer, useEffect } from "react";
import { Store } from "../../Store";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import LoadingBox from "../../components/LoadingBox";
import { Card, Col, Row } from "react-bootstrap";
import Chart from "react-google-charts";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, summary: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Dashboard() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/summary",
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "抓取資料失敗" });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <Helmet>
        <title className="text-center">管理面板</title>
      </Helmet>
      <h3>歡迎{userInfo.name}主管</h3>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        error
      ) : (
        <div className="dashboard">
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    本站註冊帳號數量為
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                    個
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    總銷售金額為
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales
                      : 0}
                    元
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    已結帳
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                    筆訂單
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h5 style={{ color: "#fff" }}>銷售金額走勢</h5>
            {summary.dailyOrders.length === 0 ? (
              "尚未有訂單"
            ) : (
              <Chart
                width="100%"
                height="300px"
                chartType="AreaChart" //折線圖
                loader={<div>圖表載入中,請稍候...</div>}
                data={[
                  ["日期", "金額"], //X軸 Y軸
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]), //圖表資料
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h5 style={{ color: "#fff" }}>全站商品種類佔比</h5>
            {summary.productCategories.length === 0 ? (
              "尚未有訂單"
            ) : (
              <Chart
                width="100%"
                height="300px"
                chartType="PieChart" //圓餅圖
                loader={<div>圖表載入中,請稍候...</div>}
                data={[
                  ["種類", "商品名稱"], //X軸 Y軸
                  ...summary.productCategories.map((x) => [x._id, x.count]), //圖表資料
                ]}
              ></Chart>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
