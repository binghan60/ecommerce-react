import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Rating from "./components/Rating";
import LoadingBox from "../../components/LoadingBox";
import { Row, Col, Button } from "react-bootstrap";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import ProductCard from "./components/ProductCard";
import SearchBox from "../../components/SerachBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    //FETCH成功後 把data丟進payload
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $500",
    value: "1-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
  {
    name: "$1001 to $2000",
    value: "1001-2000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all"; // Shirts
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        //如果沒有query string就搜all
        const { data } = await axios.get(
          `http://localhost:5000/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: "搜尋商品失敗",
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/categories`
        );
        setCategories(data);
      } catch (err) {
        toast.error("取得篩選選項失敗");
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    //篩選時link到以下網址 再用new URLSearchParams(search)抓網址中的值 訪問對應後端抓資料
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/productlist?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>購物商城</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <div className="mb-4">
            <SearchBox />
          </div>
          <h3>種類</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={"all" === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: "all" })}
                >
                  顯示全部
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    //假如網址的category 跟 c一樣 就顯示粗體
                    className={c === category ? "text-bold" : ""}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>價格</h3>
            <ul>
              <li>
                <Link
                  className={"all" === price ? "text-bold" : ""}
                  to={getFilterUrl({ price: "all" })}
                >
                  顯示全部
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? "text-bold" : ""}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>評價</h3>
            <ul>
              <li>
                <Link
                  to={getFilterUrl({ rating: "all" })}
                  className={rating === "all" ? "text-bold" : ""}
                >
                  顯示全部
                </Link>
              </li>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                  >
                    <Rating ratingTitle={" "} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            { error }
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={8}>
                  <div>
                    <h5>
                      {search &&
                      search !==
                        `?category=all&query=all&price=all&rating=all&order=${order}&page=1`
                        ? "篩選條件"
                        : "共有 " + countProducts + " 項商品"}
                      {query !== "all" && " : " + query}
                      {category !== "all" && " , 種類為" + category}
                      {price !== "all" && " , 價格" + price + "元"}
                      {rating !== "all" && " , 評價" + rating + "顆星以上"}
                      {/* 有任一篩選條件時，顯示 X 按鈕 清空queryString */}
                      {query !== "all" ||
                      category !== "all" ||
                      rating !== "all" ||
                      price !== "all" ? (
                        <Button
                          variant="light"
                          onClick={() => navigate("/productlist")}
                        >
                          <i className="fas fa-times-circle"></i>
                        </Button>
                      ) : null}
                    </h5>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <h5>
                    {"排序方式 :" + " "}
                    <select
                      value={order}
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                    >
                      <option value="newest">依上架時間</option>
                      <option value="lowest">價格: 由低至高</option>
                      <option value="highest">價格: 由高至低</option>
                      <option value="toprated">評價: 由高至低</option>
                    </select>
                  </h5>
                </Col>
              </Row>
              {/* 產品顯示區 */}
              {products.length === 0 && "找不到符合條件商品"}

              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <ProductCard ProductData={product}></ProductCard>
                  </Col>
                ))}
              </Row>

              <div className="text-center my-3">
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SearchPage;
