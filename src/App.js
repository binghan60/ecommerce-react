import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductPage from "./pages/ProductList/ProductPage";
import Reserve from "./pages/Reserve/Reserve";
import Member from "./pages/Member/Member";
import CartPage from "./pages/CartPage/CartPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <>
      <BrowserRouter>
        <Helmet>
          <title>燒肉屋</title>
        </Helmet>
        <div className="d-flex flex-column site-container">
          <header>
            <Navbar />
          </header>
          <main>
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/member" element={<Member />} />
                <Route path="/ProductList/:slug" element={<ProductPage />} />
                <Route path="/ProductList" element={<ProductList />} />
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
