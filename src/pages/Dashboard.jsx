import React, { useState } from 'react';
import { Header, Card, Button, Input, Alert } from '../components';

const Dashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddWallet = () => {
    // Add wallet logic
  };

  return (
    <div>
      <Header 
        title="Dashboard" 
        subtitle="Welcome to your crypto portfolio" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-500 text-lg font-semibold mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-gray-900">$0.00</p>
        </Card>
        
        <Card>
          <h3 className="text-gray-500 text-lg font-semibold mb-2">24h Change</h3>
          <p className="text-3xl font-bold text-green-600">+0.00%</p>
        </Card>
        
        <Card>
          <h3 className="text-gray-500 text-lg font-semibold mb-2">Holdings</h3>
          <p className="text-3xl font-bold text-gray-900">{wallets.length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Your Wallets</h2>
        {wallets.length === 0 ? (
          <p className="text-gray-500">No wallets yet</p>
        ) : (
          <div>Wallet list</div>
        )}
        <Button onClick={handleAddWallet} className="mt-4">
          Add Wallet
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;
