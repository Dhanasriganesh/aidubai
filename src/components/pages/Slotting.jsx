import React, { useState, useEffect } from 'react';
 
const SlottingPage = () => {
  const [products, setProducts] = useState([]);
  const [rearrangedProducts, setRearrangedProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
 
  // Fetching products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productss'); // if your backend is running on 5000        ;
        const data = await response.json();
        setProducts(data);
        setRearrangedProducts(data);
        setOriginalProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
 
    fetchProducts();
  }, []);
 
  // Handle rearranging products
  const handleRearrange = async () => {
    try {
      // First, calculate the rearrangement without saving
      const response = await fetch('http://localhost:5000/api/calculate-rearrangement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });
 
      if (!response.ok) {
        throw new Error('Failed to calculate rearrangement');
      }
 
      const rearrangedProducts = await response.json();
      console.log('Calculated rearrangement:', rearrangedProducts);
     
      // Update the state to show the proposed rearrangement
      setProducts(rearrangedProducts);
      setOriginalProducts(rearrangedProducts);
     
      // Show success message
      setMessage('Products rearranged successfully! Click "Save Changes" to make it permanent.');
      setMessageType('success');
    } catch (error) {
      console.error('Error rearranging products:', error);
      setMessage(error.message || 'Error rearranging products.');
      setMessageType('error');
    }
  };
 
  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save-rearrangement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });
 
      if (!response.ok) {
        throw new Error('Failed to save rearrangement');
      }
 
      const savedProducts = await response.json();
      console.log('Saved rearrangement:', savedProducts);
     
      // Update the state with the saved products
      setProducts(savedProducts);
      setOriginalProducts(savedProducts);
     
      // Show success message
      setMessage('Changes saved successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error saving changes:', error);
      setMessage(error.message || 'Error saving changes.');
      setMessageType('error');
    }
  };
 
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Slotting System</h1>
     
      {message && (
        <div className={`mb-4 p-4 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
 
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleRearrange}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Rearrange Products
        </button>
       
        <button
          onClick={handleSaveChanges}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
 
      {/* Product Table Before Rearrangement */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Products in Bins</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Product Name</th>
              <th className="px-4 py-2 border border-gray-300">Bin Name</th>
              <th className="px-4 py-2 border border-gray-300">Rack (x, y)</th>
              <th className="px-4 py-2 border border-gray-300">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-300">{product.product_name}</td>
                <td className="px-4 py-2 border border-gray-300">{product.bin_name}</td>
                <td className="px-4 py-2 border border-gray-300">{`(${product.rack_x}, ${product.rack_y})`}</td>
                <td className="px-4 py-2 border border-gray-300">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Rearranged Product Table */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Rearranged Products</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Product Name</th>
              <th className="px-4 py-2 border border-gray-300">Bin Name</th>
              <th className="px-4 py-2 border border-gray-300">Rack (x, y)</th>
              <th className="px-4 py-2 border border-gray-300">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {rearrangedProducts.map((product, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-300">{product.product_name}</td>
                <td className="px-4 py-2 border border-gray-300">{product.bin_name}</td>
                <td className="px-4 py-2 border border-gray-300">{`(${product.rack_x}, ${product.rack_y})`}</td>
                <td className="px-4 py-2 border border-gray-300">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default SlottingPage;