import React from 'react';

const SearchBar = ({ query, setQuery, handleSearch, limit, setLimit }) => {
  return (
    <div className="flex mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search interests..."
        className="flex-grow p-2 border border-gray-300 rounded"
      />
      <button
        onClick={() => handleSearch(false)}
        className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
      >
        Search
      </button>
      <select
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        className="ml-2 p-2 border border-gray-300 rounded"
      >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
        <option value={200}>200</option>
      </select>
    </div>
  );
};

export default SearchBar;
