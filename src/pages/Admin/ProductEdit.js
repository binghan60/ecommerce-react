import { useState, useEffect, useReducer, useContext } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../components/LoadingBox";
import { Store } from "../../Store";
import axios from "axios";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETRCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function ProductEdit() {
  const navigate = useNavigate();
  const params = useParams(); // app js裡設定的:id{id: 'sjuvimcv23541xcc'}
  const { id: productId } = params; //id rename成productId
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: "取得商品資料失敗",
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        //不會回傳 不需要用變數接
        `http://localhost:5000/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("修改成功");
      navigate("/admin/adminproducts");
    } catch (err) {
      toast.error("修改失敗");
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className="w-50">
      <Helmet>
        <title>編輯{productId}資訊</title>
      </Helmet>
      <h3>商品編號{productId}</h3>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        "發生錯誤"
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>商品名稱</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>商品別名</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>價格</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>圖片</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>種類</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>庫存</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>品牌</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>描述</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="my-4 text-center">
            <Button disabled={loadingUpdate} type="submit">
              送出修改
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}

export default ProductEdit;
