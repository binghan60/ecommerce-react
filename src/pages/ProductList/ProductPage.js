import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const [ProductPageData, setProductPageData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `http://localhost:5000/api/products/slug/${slug}`
      );
      setProductPageData(result.data);
    };
    fetchData();
  }, [slug]);
  return (
    <>
      <div>
        <img src={`/imgs/${ProductPageData.img}`} alt="" />
        <Link to={"/ProductList"}>
          <button className="btn btn-light">回商品列表</button>
        </Link>
      </div>
    </>
  );
}

export default ProductPage;
