import React, { useState } from 'react';
import numeral from 'numeral';

const ResultsTable = ({ data, handleSearch, nextPage, handleSelect }) => {
  const [sortConfig, setSortConfig] = useState(null);

  const formatPath = (path) => path.join(" > ");
  const formatAudienceSize = (lower, upper) =>
    `${numeral(lower).format("0.0a")} - ${numeral(upper).format("0.0a")}`;

  const sortedData = [...data];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left">
            <th className="border py-2" onClick={() => requestSort('name')}>Name</th>
            <th className="border py-2" onClick={() => requestSort('path')}>Path</th>
            <th className="border py-2" onClick={() => requestSort('audience_size')}>Audience Size</th>
            <th className="border py-2" onClick={() => requestSort('topic')}>Topic</th>
            <th className="border py-2" onClick={() => requestSort('disambiguation_category')}>Disambiguation Category</th>
            <th className="border py-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{formatPath(item.path)}</td>
              <td className="border px-4 py-2">
                {formatAudienceSize(
                  item.audience_size_lower_bound,
                  item.audience_size_upper_bound
                )}
              </td>
              <td className="border px-4 py-2">{item.topic}</td>
              <td className="border px-4 py-2">
                {item.disambiguation_category || "N/A"}
              </td>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  onChange={() => handleSelect(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {nextPage && (
        <button
          onClick={() => handleSearch(true)}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Load More
        </button>
      )}
    </>
  );
};

export default ResultsTable;
