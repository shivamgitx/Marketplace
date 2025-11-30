import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});

  const url = "http://localhost:4000"; // Backend URL - to be updated for production

  useEffect(() => {
    async function loadData() {
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
      const userId = localStorage.getItem("userId");
      if (userId) {
        await getCartItems(userId);
      }
    }
    loadData();
  }, []);

  // Function to fetch user's cart items
  const getCartItems = async (userId) => {
    try {
      const response = await axios.post(url + "/api/cart/get", { userId });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Function to add item to cart
  const addToCart = async (itemId, userId) => {
    try {
      const response = await axios.post(url + "/api/cart/add", { itemId, userId });
      if (response.data.success) {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (itemId, userId) => {
    try {
      const response = await axios.post(url + "/api/cart/remove", { itemId, userId });
      if (response.data.success) {
        setCartItems((prev) => {
          const newCart = { ...prev };
          if (newCart[itemId] > 1) {
            newCart[itemId] -= 1;
          } else {
            delete newCart[itemId];
          }
          return newCart;
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Function to get total cart amount
  const getTotalCartAmount = (products) => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const contextValue = {
    url,
    token,
    setToken,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getCartItems,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;