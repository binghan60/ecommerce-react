import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Product from "./pages/Products/Product";
import Reserve from "./pages/Reserve/Reserve";
import Member from "./pages/Member/Member";
import Cart from "./pages/Cart/Cart";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/member" element={<Member />} />
            <Route path="/product" element={<Product />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
