import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductPage from "./pages/ProductList/ProductPage";
import Reserve from "./pages/Reserve/Reserve";
import Member from "./pages/Member/Member";
import Cart from "./pages/Cart/Cart";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <BrowserRouter>
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
                <Route path="/cart" element={<Cart />} />
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
