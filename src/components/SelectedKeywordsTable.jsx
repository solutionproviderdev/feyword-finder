import React, { useState } from "react";
import { BsCheck2, BsCopy } from "react-icons/bs";
import { FaCopy } from "react-icons/fa";

const SelectedKeywordsTable = ({ selectedKeywords }) => {
  const [copiedText, setCopiedText] = useState(null);

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    const timer = setTimeout(() => setCopiedText(null), 1000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Selected Keywords</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="text-xs text-left text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Path</th>
              <th className="px-6 py-3">Topic</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedKeywords.map((item) => (
              <tr key={item.id} className="text-sm text-gray-700">
                <td className="px-6 py-4 flex items-center justify-between">
                {item.name}
                <button
                  className="ml-2 text-gray-500"
                  onClick={() => handleCopy(item.name)}
                >
                  {copiedText && copiedText === item.name ? (
                    <BsCheck2 />
                  ) : (
                    <BsCopy />
                  )}
                </button>
              </td>
                <td className="px-6 py-4">
                  {item.path ? item.path.join(" > ") : ""}
                </td>
                <td className="px-6 py-4">{item.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelectedKeywordsTable;
