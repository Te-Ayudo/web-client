// CartContext.jsx
import { createContext, useContext } from "react";
export const CartContext = createContext({ openCart: () => {} });
export const useCart = () => useContext(CartContext);
