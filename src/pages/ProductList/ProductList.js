import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "./components/ProductCard";
import axios from "axios";
import SearchBox from "../../components/SerachBox";

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
      <h3>商品列表</h3>
      <SearchBox></SearchBox>
      <main className="d-flex">
        <Row>
          {ProductData.map((ProductData) => {
            return (
              <Col sm={6} md={4} lg={3} className="mb-4" key={ProductData.slug}>
                <ProductCard ProductData={ProductData}></ProductCard>
              </Col>
            );
          })}
        </Row>
      </main>
    </>
  );
}

export default ProductList;
