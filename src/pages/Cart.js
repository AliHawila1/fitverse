import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = ({ cart, removeFromCart, clearCart, user }) => {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace('$', '').replace(/[^0-9]/g, ''));
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      const payload = {
        userId: user.user_id,
        userEmail: user.email,
        total: getTotalPrice(),
        items: cart.map(item => ({
          item_type: item.type,
          item_id: item.id,
          item_name: item.name,
          price: item.price.replace('$',''),
          quantity: 1,
          sheetLink: item.sheetLink // only for programs
        }))
      };

      await axios.post("http://localhost:5000/orders/checkout", payload);

      alert("Checkout completed! Emails sent for programs.");
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-28 px-6 md:px-12">
      <h1 className="text-4xl font-bold text-center mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <div className="flex justify-center space-x-4">
            <Link to="/equipments">
              <button className="bg-[#00df9a] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#00c785] transition duration-300">
                Shop Equipment
              </button>
            </Link>
            <Link to="/services">
              <button className="bg-[#00df9a] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#00c785] transition duration-300">
                Browse Programs
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 px-4 py-2">#</th>
                  <th className="border border-gray-600 px-4 py-2">Name</th>
                  <th className="border border-gray-600 px-4 py-2">Type</th>
                  <th className="border border-gray-600 px-4 py-2">Description</th>
                  <th className="border border-gray-600 px-4 py-2">Price</th>
                  <th className="border border-gray-600 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index} className="bg-gray-900 hover:bg-gray-700">
                    <td className="border border-gray-600 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-600 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-600 px-4 py-2">{item.type}</td>
                    <td className="border border-gray-600 px-4 py-2">{item.description}</td>
                    <td className="border border-gray-600 px-4 py-2 text-[#00df9a] font-bold">{item.price}</td>
                    <td className="border border-gray-600 px-4 py-2">
                      <button
                        onClick={() => removeFromCart(index)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Buttons */}
          <div className="flex justify-between items-center mt-6 bg-gray-800 p-6 rounded-2xl">
            <p className="text-2xl font-bold">Total: <span className="text-[#00df9a]">${getTotalPrice()}</span></p>
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-[#00df9a] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#00c785] transition duration-300"
              >
                Checkout (${getTotalPrice()})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
