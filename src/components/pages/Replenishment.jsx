import React, { useState, useEffect } from 'react';

const Replenishment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample Inventory data
  const inventory = [
    { id: 1, name: 'Air Conditioner', currentStock: 15, minStock: 20, location: 'A1', status: 'low', description: 'Split AC 1.5 Ton' },
    { id: 2, name: 'Electric Fan', currentStock: 45, minStock: 30, location: 'B2', status: 'ok', description: 'Standing Fan 16"' },
    { id: 3, name: 'Cooler', currentStock: 8, minStock: 25, location: 'C3', status: 'critical', description: 'Desert Cooler 50L' },
    { id: 4, name: 'Dehumidifier', currentStock: 30, minStock: 20, location: 'D4', status: 'ok', description: 'Portable Dehumidifier' },
  ];

  // Simulate fetching seasonal products based on the selected month
  useEffect(() => {
    const fetchSeasonalProducts = async () => {
      setLoading(true);

      const mockSeasonalData = [
        { id: 1, name: 'Air Conditioner', season: 'Summer', highFlowLocation: 'X1', historicalDemand: 150 },
        { id: 2, name: 'Electric Fan', season: 'Summer', highFlowLocation: 'X2', historicalDemand: 200 },
        { id: 3, name: 'Cooler', season: 'Summer', highFlowLocation: 'X3', historicalDemand: 100 },
        { id: 4, name: 'Heater', season: 'Winter', highFlowLocation: 'X4', historicalDemand: 120 },
        { id: 5, name: 'Room Heater', season: 'Winter', highFlowLocation: 'X5', historicalDemand: 110 },
        { id: 6, name: 'Raincoat', season: 'Rainy', highFlowLocation: 'X6', historicalDemand: 50 },
        { id: 7, name: 'Umbrella', season: 'Rainy', highFlowLocation: 'X7', historicalDemand: 70 },
      ];

      // Filter seasonal products based on the selected month (Summer: Mar-May, Rainy: Jun-Sep, Winter: Oct-Feb)
      const season = getSeasonFromMonth(selectedMonth);

      const filteredProducts = season ? mockSeasonalData.filter(product => product.season === season) : [];
      setSeasonalProducts(filteredProducts);
      setLoading(false);
    };

    fetchSeasonalProducts();
  }, [selectedMonth]);

  // Logic to determine the season from the selected month
  const getSeasonFromMonth = (month) => {
    if (month >= 3 && month <= 5) return 'Summer'; // Mar-May
    if (month >= 6 && month <= 9) return 'Rainy'; // Jun-Sep
    if (month === 10 || month === 11 || month === 12 || month <= 2) return 'Winter'; // Oct-Feb
    return 'N/A';
  };

  // Get the name of the month for display
  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const handleReplenish = async (id) => {
    console.log(`Requesting replenishment for product ID: ${id}`);
  
    // Find the product name
    const product = seasonalProducts.find(item => item.id === id);
    if (!product) return;
  
    try {
      // Make an API call to assign the task to a worker
      const response = await fetch('/api/replenish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(`Replenishment task successfully assigned to worker: ${data.worker}`);
      } else {
        alert(data.message || 'Error assigning task');
      }
    } catch (error) {
      console.error('Error while requesting replenishment:', error);
      alert('Failed to request replenishment');
    }
  };
  
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Replenishment</h1>

      {/* Month/Year Select */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Seasonal Product Management</h2>
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block mb-1">Select Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border rounded"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{getMonthName(month)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border rounded"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="text-lg mt-8">
            Current Season: <strong>{getSeasonFromMonth(selectedMonth)}</strong>
          </div>
        </div>
      </div>

      {/* Seasonal Products */}
      {loading ? (
        <div className="text-center py-4">Loading seasonal products...</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">High-Flow Products for {getMonthName(selectedMonth)} {selectedYear}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasonalProducts.map(product => (
              <div key={product.id} className="bg-gray-100 p-4 rounded">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-700">High-Flow Location: {product.highFlowLocation}</p>
                <p className="text-sm text-gray-700">Historical Demand: {product.historicalDemand}</p>

                {/* Request Replenishment Button */}
                <button
                  onClick={() => handleReplenish(product.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-900"
                >
                  Request Replenishment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="ok">OK</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical</option>
          </select>

          <select
            className="px-4 py-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock Level</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory
              .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.currentStock}</td>
                  <td className="px-6 py-4">{item.minStock}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${item.status === 'ok' ? 'bg-green-100 text-green-800' : item.status === 'low' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {item.status === 'ok' ? 'OK' : item.status === 'low' ? 'Low Stock' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Replenishment;
