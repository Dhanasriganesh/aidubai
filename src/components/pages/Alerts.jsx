import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Link } from "react-router-dom";
const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const getAlerts = async () => {
      const products = await fetchProducts();
      const today = new Date();
      const expiringProducts = products.filter((product) => {
        const expiryDate = new Date(product.expiry_date);
        const diffDays = (expiryDate - today) / (1000 * 60 * 60 * 24);
        return diffDays <= 20; // Alert for products expiring in 20 days or less
      });

      // Sort the products by remaining days in ascending order
      const sortedAlerts = expiringProducts.sort((a, b) => {
        const daysA = Math.ceil((new Date(a.expiry_date) - today) / (1000 * 60 * 60 * 24));
        const daysB = Math.ceil((new Date(b.expiry_date) - today) / (1000 * 60 * 60 * 24));
        return daysA - daysB;
      });

      setAlerts(sortedAlerts);
    };

    getAlerts();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
        <div>
            <Link to="/">
                <button>
                    Dashoard
                </button>
            </Link>
        </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Expiry Alerts</h1>
      {alerts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No products nearing expiry.</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((product) => {
            const remainingDays = Math.ceil((new Date(product.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
            return (
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
                  <p>
                    <strong>Remaining Days:</strong> {remainingDays} days
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-red-500 font-medium">
                    <strong>Action Needed !</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
