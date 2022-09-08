import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductPage from "./pages/ProductList/ProductPage";
import Reserve from "./pages/Reserve/Reserve";
import SignIn from "./pages/Member/SingIn";
import CartPage from "./pages/CartPage/CartPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
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
                <Route path="/singin" element={<SignIn />} />
                <Route path="/productList/:slug" element={<ProductPage />} />
                <Route path="/productList" element={<ProductList />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/cartpage" element={<CartPage />} />
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
