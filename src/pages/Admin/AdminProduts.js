import axios from "axios";
import { useReducer, useEffect, useContext } from "react";
import { Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "react-router-dom";
import LoadingBox from "../../components/LoadingBox";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

function AdminProduts() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { search, pathname } = useLocation();
  //search是useLocation下的變數代表整串query string 從?開始的值
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `http://localhost:5000/api/products/admin?page=${page}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: "取得商品列表失敗" });
      }
    };
    fetchData();
  }, [page, userInfo]);

  return (
    <>
      <Helmet>
        <title className="text-center">商品管理</title>
      </Helmet>
      <h3>商品</h3>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        "發生錯誤"
      ) : (
        <>
          <table className="table table-dark">
            <thead>
              <tr>
                <th>商品ID</th>
                <th>名稱</th>
                <th>價格</th>
                <th>種類</th>
                <th>品牌</th>
                {/* <th>動作</th> */}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.brand}</td>
                  {/* <td>{product._id}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? "btn text-bold" : "btn"} //x從0開始 因此x+1
                key={x + 1}
                to={`/admin/adminproducts?page=${x + 1}`}
              >{x + 1}</Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default AdminProduts;
