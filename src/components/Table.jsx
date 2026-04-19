import React from 'react';

const Table = ({ columns, data, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${className}`}>
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            {columns.map((column) => (
              <th 
                key={column.key}
                className="px-4 py-2 text-left font-semibold text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              {columns.map((column) => (
                <td 
                  key={column.key}
                  className="px-4 py-3 text-gray-700"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
