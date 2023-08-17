import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Sidebar, Footer } from "./components";

import {
  Home,
  SingleProduct,
  Cart,
  Checkout,
  Error,
  About,
  Products,
  Private,
} from "./pages";

function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/products/:id" element={<SingleProduct />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
