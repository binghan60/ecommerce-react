import axios from "axios";
import { useReducer, useEffect, useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

function AdminProducts() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { search } = useLocation();
  //search是useLocation下的變數代表整串query string 從?開始的值
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  //取得資料列表
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
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "取得商品列表失敗" });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" }); //成功刪除重置successDelete狀態  重新觸發這個useEffect
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm("確定要新增商品?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          "http://localhost:5000/api/products",
          {}, //沒有傳資料給後端
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        toast.success("成功新增");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/adminproducts/${data.product._id}`);
      } catch (err) {
        toast.error("新增失敗");
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };
  //刪除商品
  const deleteHandler = async (product) => {
    if (window.confirm("確定要刪除")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(
          `http://localhost:5000/api/products/${product._id}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("刪除成功");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error("刪除失敗");
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  return (
    <>
      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}
      {/* loading中以下就不會出現 */}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        "發生錯誤"
      ) : (
        <>
          <Helmet>
            <title className="text-center">商品管理</title>
          </Helmet>
          <Row>
            <Col>
              <h3 className="my-3">商品管理</h3>
            </Col>
            <Col className="col text-end">
              <Button type="button" onClick={createHandler}>
                <i className="fa-solid fa-plus"></i> 新商品
              </Button>
            </Col>
            <table className="table table-dark text-center">
              <thead>
                <tr>
                  <th>商品編號</th>
                  <th>名稱</th>
                  <th>價格</th>
                  <th>種類</th>
                  <th>品牌</th>
                  <th>功能</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <Link to={`/productlist/${product.slug}`}>
                        {product._id}
                      </Link>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>

                    <td>
                      <Button
                        className="mx-1"
                        type="button"
                        variant="success"
                        onClick={() =>
                          navigate(`/admin/adminproducts/${product._id}`)
                        }
                      >
                        編輯
                      </Button>
                      <Button
                        className="mx-1"
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(product)}
                      >
                        刪除
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Row>
        </>
      )}
    </>
  );
}

export default AdminProducts;
