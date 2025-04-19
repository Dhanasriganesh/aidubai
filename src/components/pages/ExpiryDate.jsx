import React, { useEffect, useState } from "react";
import axios from "axios"; // Replace this if you use a custom `fetchProducts` service
import { Link } from "react-router-dom";

const ExpiryDate = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/products");
                setProducts(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    const getRowColor = (daysUntilExpiry) => {
        if (daysUntilExpiry == null) return "bg-gray-300 text-black";
        if (daysUntilExpiry <= 5) return "bg-red-500 text-white";
        if (daysUntilExpiry <= 15) return "bg-blue-400 text-black";
        return "bg-green-500 text-white";
    };

    const getStatus = (daysUntilExpiry) => {
        if (daysUntilExpiry == null) return "Unknown";
        if (daysUntilExpiry < 0) return "Expired";
        if (daysUntilExpiry <= 15) return "Near Expiry";
        return "Safe";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Expiry Management</h1>

            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Until Expiry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rack/Bin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className={getRowColor(product.days_until_expiry)}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(product.expiry_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.days_until_expiry != null
                                        ? product.days_until_expiry < 0
                                            ? 'Expired'
                                            : `${product.days_until_expiry} days`
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.rack_bin}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatus(product.days_until_expiry)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-6 mt-8">
                <Link to="/alerts">
                    <button className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition">
                        View Alerts
                    </button>
                </Link>
                <Link to="/recommendations">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        View Recommendations
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ExpiryDate;
