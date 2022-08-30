import { useParams, Link } from "react-router-dom";

function ProductPage() {
  const params = useParams();
  const { slug } = params;
  return (
    <div>
      {slug}
      <Link to={"/ProductList"}>
        <button className="btn btn-light">回商品列表</button>
      </Link>
    </div>
  );
}

export default ProductPage;
