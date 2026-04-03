import React, { useState } from 'react';
import { Header, Card, Button, Input, Alert } from '../components';

const Settings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);

  const handleAddAddress = () => {
    if (newAddress) {
      setWhitelistedAddresses([...whitelistedAddresses, newAddress]);
      setNewAddress('');
    }
  };

  const handleRemoveAddress = (address) => {
    setWhitelistedAddresses(whitelistedAddresses.filter(a => a !== address));
  };

  return (
    <div>
      <Header 
        title="Settings" 
        subtitle="Manage your security and account preferences" 
      />

      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            className="w-5 h-5"
          />
          <span>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Address Whitelist</h3>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="checkbox"
            checked={whitelistEnabled}
            onChange={(e) => setWhitelistEnabled(e.target.checked)}
            className="w-5 h-5"
          />
          <span>{whitelistEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>

        {whitelistEnabled && (
          <div>
            <Input
              label="Add Address to Whitelist"
              placeholder="Enter wallet address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleAddAddress} size="sm" className="mb-4">
              Add Address
            </Button>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Whitelisted Addresses:</h4>
              {whitelistedAddresses.map((address, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                  <span className="text-sm break-all">{address}</span>
                  <button
                    onClick={() => handleRemoveAddress(address)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Account</h3>
        <Button variant="danger">Delete Account</Button>
      </Card>
    </div>
  );
};

export default Settings;
