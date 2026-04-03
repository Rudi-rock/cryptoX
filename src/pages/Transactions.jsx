import React, { useState } from 'react';
import { Header, Card, Button, Input, Table } from '../components';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
  ];

  const filteredTransactions = transactions.filter(
    t => filterType === 'all' || t.type === filterType
  );

  return (
    <div>
      <Header 
        title="Transactions" 
        subtitle="View and manage your transaction history" 
      />

      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Filter Transactions</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType('deposit')}
            className={`px-4 py-2 rounded ${filterType === 'deposit' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Deposits
          </button>
          <button 
            onClick={() => setFilterType('withdrawal')}
            className={`px-4 py-2 rounded ${filterType === 'withdrawal' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Withdrawals
          </button>
        </div>
      </Card>

      <Card>
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500">No transactions found</p>
        ) : (
          <Table columns={columns} data={filteredTransactions} />
        )}
      </Card>
    </div>
  );
};

export default Transactions;
