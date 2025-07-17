import React, { useEffect, useState } from "react";
import axios from "axios";

function VendorDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("vendor_token");
    axios.get("/api/vendor/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data));
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Products</div>
          <div className="text-2xl font-bold">{data.total_products}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Orders This Week</div>
          <div className="text-2xl font-bold">{data.total_orders_this_week}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Sales This Week</div>
          <div className="text-2xl font-bold">₹{data.total_sales_this_week}</div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Order ID</th>
              <th className="text-left py-2">Product</th>
              <th className="text-left py-2">Qty</th>
              <th className="text-left py-2">Price</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recent_orders.map(order => (
              <tr key={order.order_id}>
                <td className="py-2">{order.order_id}</td>
                <td className="py-2">{order.product}</td>
                <td className="py-2">{order.quantity}</td>
                <td className="py-2">₹{order.price}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded ${order.status === "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VendorDashboard;