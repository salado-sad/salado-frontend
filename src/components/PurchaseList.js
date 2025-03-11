import React, { useState, useEffect } from 'react';
import './PurchaseList.css';
import Cookies from "js-cookie";

const statusOptions = [
  "Awaiting admin approval",
  "Approved by admin",
  "Ready for pickup",
  "On delivery",
  "Delivered",
  "Agha Shayan"
];

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch purchases on component mount
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('http://localhost:8000/cart/public/purchases/');
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPurchases();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (purchaseId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/cart/public/purchases/${purchaseId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
            },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setPurchases(purchases.map(purchase => 
          purchase.id === purchaseId ? { ...purchase, status: newStatus } : purchase
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="purchase-list">
      <h1>Purchase Management</h1>
      {loading ? (
        <p>Loading purchases...</p>
      ) : (
        <div className="purchase-grid">
          {purchases.map(purchase => (
            <div key={purchase.id} className="purchase-card">
              <div className="purchase-info">
                <h3>Purchase #{purchase.id}</h3>
                <p>User: {purchase.user}</p>
                <p>Package: {purchase.package}</p>
                <p>Quantity: {purchase.quantity}</p>
                <p>Date: {new Date(purchase.purchased_at).toLocaleString()}</p>
              </div>
              <div className="status-control">
                <select
                  value={purchase.status}
                  onChange={(e) => handleStatusUpdate(purchase.id, e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseList;