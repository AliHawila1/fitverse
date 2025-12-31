import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = ({ cart, clearCart, user, removeFromCart }) => {
  
  // Calculates the total price by cleaning currency strings and summing them up
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const priceString = String(item.price);
      const price = parseFloat(priceString.replace(/[^0-9.]/g, ""));
      return total + (isNaN(price) ? 0 : price);
    }, 0).toFixed(2); 
  };

  const handleCheckout = async () => {
    try {
      // 1. Check if user is logged in
      if (!user) {
        alert("Please log in to checkout");
        return;
      }

      // 2. Prepare the data for the backend
      const payload = {
        user_id: user.user_id,
        items: cart.map((item) => {
          // Ensure price is a clean number before sending
          const priceString = String(item.price);
          const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ""));
          
          return {
            // Mapping your cart object to your DB columns: orders_item
            item_type: item.type || "Equipment", 
            item_id: item.equipment_id || item.program_id || item.id,
            item_name: item.equipment_name || item.program_name || item.name,
            price: numericPrice,
            quantity: 1, // Defaulting to 1
          };
        }),
      };

      // 3. Send the POST request to the backend
      // Note: No "/api" prefix as requested
      const response = await axios.post("http://localhost:5000/orders", payload);

      if (response.status === 201) {
        alert(`Checkout completed! Order #${response.data.order_id} has been saved.`);
        clearCart(); // Clear the cart after success
      }
    } catch (err) {
      console.error("Checkout Error:", err.response || err);
      alert("Checkout failed. Please check if your server is running.");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-28 px-6 md:px-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#00df9a]">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4 text-gray-400">Your cart is empty</p>
          <div className="flex justify-center space-x-4">
            <Link to="/equipments">
              <button className="bg-[#00df9a] text-black font-bold py-3 px-6 rounded-lg hover:bg-white transition">
                Shop Equipment
              </button>
            </Link>
            <Link to="/services">
              <button className="bg-[#00df9a] text-black font-bold py-3 px-6 rounded-lg hover:bg-white transition">
                Browse Programs
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-3 text-[#00df9a]">#</th>
                  <th className="border border-gray-700 px-4 py-3">Name</th>
                  <th className="border border-gray-700 px-4 py-3">Type</th>
                  <th className="border border-gray-700 px-4 py-3">Price</th>
                  <th className="border border-gray-700 px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index} className="bg-gray-900 hover:bg-gray-800 transition">
                    <td className="border border-gray-700 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-700 px-4 py-2">{item.name || item.equipment_name || item.program_name}</td>
                    <td className="border border-gray-700 px-4 py-2 text-gray-400">{item.type || "Product"}</td>
                    <td className="border border-gray-700 px-4 py-2 text-[#00df9a] font-bold">
                      ${item.price}
                    </td>
                    <td className="border border-gray-700 px-4 py-2 text-center">
                      <button
                        onClick={() => removeFromCart(index)}
                        className="bg-red-600 text-white py-1 px-4 rounded hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 bg-gray-900 border border-gray-700 p-6 rounded-2xl">
            <p className="text-2xl font-bold mb-4 md:mb-0">
              Total: <span className="text-[#00df9a]">${getTotalPrice()}</span>
            </p>
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="border border-red-600 text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-[#00df9a] text-black font-bold py-3 px-8 rounded-lg hover:bg-white transition"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;