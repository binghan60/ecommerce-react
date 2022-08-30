import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "./components/Product";

function ProductList() {
  const [ProductData, setProductData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:5000/api/products");
      setProductData(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <h3>產品列表</h3>
      <main className="d-flex">
        <Row>
          {ProductData.map((ProductData) => {
            return (
              <Col sm={6} md={4} lg={3} className="mb-4" key={ProductData.id}>
                <Product ProductData={ProductData}></Product>
              </Col>
            );
          })}
        </Row>
      </main>
    </>
  );
}

export default ProductList;
