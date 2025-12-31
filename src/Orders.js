import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Orders List</h1>
      <div className="overflow-x-auto w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 rounded-t-3xl">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Date Created</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{order.order_id}</td>
                <td className="px-4 py-3">{order.user_id}</td>
                <td className="px-4 py-3">{order.username}</td>
                <td className="px-4 py-3">{order.total_price}</td>
                <td className="px-4 py-3">{order.order_date}</td>
                <td className="px-4 py-3">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
