import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

function Product(props) {
  const { ProductData } = props;
  return (
    <div>
    
      <Link to={`/ProductList/${ProductData.slug}`}>
        <img className="w-100 pb-3" src={`/imgs/${ProductData.img}`} alt="" />{" "}
      </Link>
      <h6>{ProductData.name}</h6>
      <p>{ProductData.description}</p>
      <p>
        <strong>{ProductData.price}元</strong>
        <span className="float-end">庫存尚有{ProductData.countInStock}份</span>
      </p>
      <div className="text-center">
        <button className="btn btn-success">加入購物車</button>
      </div>
    </div>
  );
}

export default Product;
