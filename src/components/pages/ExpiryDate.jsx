import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
        };
        getProducts();
    }, []);

    // Function to determine row color based on expiry date
    const getRowColor = (expiryDate) => {
        const today = new Date();
        const expDate = new Date(expiryDate);
        const diffDays = (expDate - today) / (1000 * 60 * 60 * 24); // Difference in days

        if (diffDays < 0) return "bg-red-500 text-white"; // Expired (Red)
        if (diffDays <= 15) return "bg-blue-400 text-white"; // Near Expiry (Blue)
        return "bg-green-400 text-white"; // Safe (Green)
    };

    return (
        <div>
            <div className="p-4">
                {/* <h1 className="text-xl font-bold mb-4">Warehouse Dashboard</h1> */}
                <table className="table-auto w-full border">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Product Name</th>
                            <th className="border px-4 py-2">Expiry Date</th>
                            <th className="border px-4 py-2">Rack/Bin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className={getRowColor(product.expiry_date)}>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2">{product.expiry_date}</td>
                                <td className="border px-4 py-2">{product.rack_bin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center gap-10 mt-4">
                <Link to="/alerts">
                    <button className="w-20 p-2 rounded shadow-lg bg-orange-400">
                        Alerts
                    </button>
                </Link>
                <Link to="/recommendations">
                    <button className="w-36 p-2 rounded shadow-lg bg-orange-400">
                        Recommendation
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
