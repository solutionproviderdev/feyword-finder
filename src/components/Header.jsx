import React from 'react';

const Header = ({ handleTokenChange, token }) => {
  return (
    <header className="flex justify-between items-center py-4">
      <img src="path_to_logo.png" alt="Logo" className="h-10" /> {/* Add your logo */}
      <button
        onClick={handleTokenChange}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {token ? "Change Token" : "Add Token"}
      </button>
    </header>
  );
};

export default Header;
