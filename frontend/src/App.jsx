import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Success from "./pages/Success/Success";

const App = () => {
  const url = "http://localhost:4000"; // To be changed to production URL when deployed
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home url={url} />} />
        <Route path="/cart" element={<Cart url={url} />} />
        <Route path="/order" element={<PlaceOrder url={url} />} />
        <Route path="/verify" element={<Success url={url} />} />
      </Routes>
    </div>
  );
};

export default App;