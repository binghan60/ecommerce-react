import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductPage from "./pages/ProductList/ProductPage";
import Reserve from "./pages/Reserve/Reserve";
import Signin from "./pages/Member/Signin";
import Signup from "./pages/Member/Signup";
import PaymentMethod from "./pages/CartPage/PaymentMethod";
import CartPage from "./pages/CartPage/CartPage";
import ShippingAddress from "./pages/CartPage/ShippingAddress";
import PlaceOrder from "./pages/CartPage/PlaceOrder";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <Helmet>
          <title>燒肉屋</title>
        </Helmet>
        <ToastContainer position="bottom-center" limit={1} />
        <div className="d-flex flex-column site-container">
          <header>
            <NavbarComponent />
          </header>
          <main>
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/paymentmethod" element={<PaymentMethod />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/productList/:slug" element={<ProductPage />} />
                <Route path="/productList" element={<ProductList />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/cartpage" element={<CartPage />} />
                <Route path="/shippingaddress" element={<ShippingAddress />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Container>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
