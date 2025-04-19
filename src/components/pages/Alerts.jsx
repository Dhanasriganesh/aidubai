import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Link } from "react-router-dom";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const getAlerts = async () => {
      const products = await fetchProducts();
      const expiringProducts = products.filter(product =>
        product.days_until_expiry >= 0 && product.days_until_expiry <= 5
      );

      // Already sorted by expiry days from backend, but let's ensure
      const sorted = expiringProducts.sort((a, b) => a.days_until_expiry - b.days_until_expiry);
      setAlerts(sorted);
    };

    getAlerts();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div>
        <Link to="/">
          <button className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Dashboard</button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Expiry Alerts</h1>
      {alerts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No products nearing expiry.</div>
      ) : (
        <div className="space-y-4">
          {alerts.map(product => (
            <div
              key={product.id}
              className="border rounded-lg p-6 bg-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">{product.name}</h2>
                <span className="text-sm text-black">Rack/Bin: {product.rack_bin}</span>
              </div>
              <div className="text-gray-600">
                <p><strong>Expiry Date:</strong> {new Date(product.expiry_date).toLocaleDateString()}</p>
                <p><strong>Remaining Days:</strong> {product.days_until_expiry} days</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-red-500 font-medium">
                  <strong>Action Needed!</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
