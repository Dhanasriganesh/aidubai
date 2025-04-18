import React, { useState, useEffect } from "react";
import axios from "axios";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/recommendations")
      .then((response) => {
        setRecommendations(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch recommendations.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-xl font-semibold mt-10">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold mt-10">{error}</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Product Recommendations</h1>
      {recommendations.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No recommendations available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-lg p-6 bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{item.product}</h2>
              <p className="text-gray-600">
                <strong>Manufactured Date:</strong> {new Date(item.manufacturing_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Expiry Date:</strong> {new Date(item.expiry_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Remaining Days:</strong> {item.remaining_days} days
              </p>
              <p className="text-gray-600">
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p className="text-gray-600">
                <strong>Rack Bin:</strong> {item.rack_bin}
              </p>
              <p className="text-gray-600">
                <strong>Place of Origin:</strong> {item.place_of_origin}
              </p>
              <p className="text-gray-700 font-medium">
                <strong>Recommended Mart:</strong> {item.recommended_mart}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;
