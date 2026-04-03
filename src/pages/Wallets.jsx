import React, { useState } from 'react';
import { Header, Card, Button, Input } from '../components';

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    currency: '',
    address: '',
  });

  const handleAddWallet = () => {
    if (formData.currency && formData.address) {
      setWallets([...wallets, formData]);
      setFormData({ currency: '', address: '' });
      setShowAdd(false);
    }
  };

  return (
    <div>
      <Header 
        title="Wallets" 
        subtitle="Manage your cryptocurrency wallets" 
      />

      <div className="mb-6">
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Wallet'}
        </Button>
      </div>

      {showAdd && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Wallet</h3>
          <Input
            label="Cryptocurrency"
            placeholder="e.g., Bitcoin"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="mb-4"
          />
          <Input
            label="Wallet Address"
            placeholder="Enter wallet address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mb-4"
          />
          <Button onClick={handleAddWallet}>Add Wallet</Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.map((wallet, index) => (
          <Card key={index}>
            <h4 className="text-lg font-semibold">{wallet.currency}</h4>
            <p className="text-gray-600 text-sm mt-2 break-all">{wallet.address}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wallets;
