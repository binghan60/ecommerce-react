import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductPage from "./pages/ProductList/ProductPage";
import Reserve from "./pages/Reserve/Reserve";
import Signin from "./pages/Member/Signin";
import Signup from "./pages/Member/Signup";
import MemberProfile from "./pages/Member/MemberProfile";
import PaymentMethod from "./pages/CartPage/PaymentMethod";
import CartPage from "./pages/CartPage/CartPage";
import ShippingAddress from "./pages/CartPage/ShippingAddress";
import PlaceOrder from "./pages/CartPage/PlaceOrder";
import OrderPage from "./pages/CartPage/OrderPage";
import OrderHistory from "./pages/CartPage/OrderHistory";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/Admin/AdminProducts";
import ProductEdit from "./pages/Admin/ProductEdit";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import UserEdit from "./pages/Admin/UserEdit";
function App() {
  return (
    <>
      <BrowserRouter>
        <Helmet>
          <title>燒肉屋</title>
        </Helmet>
        <ToastContainer position="bottom-center" limit={1} />
        <div className="d-flex flex-column site-container">
          <header className="mb-5">
            <NavbarComponent />
          </header>
          <main>
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/memberprofile"
                  element={
                    <ProtectedRoute>
                      <MemberProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/paymentmethod" element={<PaymentMethod />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route
                  path="/orderpage/:id"
                  element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orderhistory"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route path="/productlist/:slug" element={<ProductPage />} />
                <Route path="/productlist" element={<ProductList />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/cartpage" element={<CartPage />} />
                <Route path="/shippingaddress" element={<ShippingAddress />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/adminproducts"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/adminproducts/:id"
                  element={
                    <AdminRoute>
                      <ProductEdit />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/adminorders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/adminusers"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/adminusers/:id"
                  element={
                    <AdminRoute>
                      <UserEdit />
                    </AdminRoute>
                  }
                />
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
