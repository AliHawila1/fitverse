// Cart.js
import React from "react";
import { Link } from "react-router-dom";

const Cart = ({ cart, removeFromCart, clearCart }) => {
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = parseInt(item.price.replace('$', '').replace(/[^0-9]/g, ''));
            return total + (isNaN(price) ? 0 : price);
        }, 0);
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
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800 rounded-2xl p-6 mb-6">
                        {cart.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-b border-gray-700 py-4 last:border-b-0">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <p className="text-gray-300 text-sm">{item.description}</p>
                                    <span className="inline-block bg-gray-700 px-2 py-1 rounded text-xs mt-1">
                                        {item.type === 'program' ? 'Program' : 'Equipment'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-[#00df9a] font-bold text-lg">{item.price}</p>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-800 rounded-2xl p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Total</h3>
                            <p className="text-[#00df9a] font-bold text-2xl">${getTotalPrice()}</p>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={clearCart}
                            className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={() => alert(`Checkout completed! Total: $${getTotalPrice()}`)}
                            className="bg-[#00df9a] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#00c785] transition duration-300 flex-1"
                        >
                            Checkout (${getTotalPrice()})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;