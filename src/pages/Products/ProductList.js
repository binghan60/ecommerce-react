import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
        {ProductData.map((v, i) => {
          return (
            <div key={i} className="col-3 p-4">
              <Link to={`/ProductList/${v.slug}`}>
                <img className="w-100" src={`/imgs/${v.img}`} alt="" />{" "}
              </Link>
              <h6>{v.name}</h6>
              <p>{v.description}</p>
              <p>
                <strong>{v.price}元</strong>
                <span className="float-end">庫存尚有{v.countInStock}份</span>
              </p>
              <div className="text-center">
                <button className="btn btn-success">加入購物車</button>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}

export default ProductList;
