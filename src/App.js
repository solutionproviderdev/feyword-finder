import React, { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";

const App = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [limit, setLimit] = useState(25); // New state for limit

  useEffect(() => {
    const savedToken = localStorage.getItem("fb_access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleTokenChange = () => {
    const newToken = prompt("Please enter your access token");
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("fb_access_token", newToken);
    }
  };

  const handleSearch = async (next = false) => {
    if (!token) {
      alert("Please add your access token first.");
      return;
    }
    setLoading(true);
    try {
      const params = {
        type: "adinterest",
        q: query,
        access_token: token,
        limit: limit, // Use the selected limit
      };

      if (next && nextPage) {
        const response = await axios.get(nextPage);
        setData([...data, ...response.data.data]);
        setNextPage(response.data.paging.next);
      } else {
        const response = await axios.get(
          `https://graph.facebook.com/v13.0/search`,
          { params }
        );
        setData(response.data.data);
        setNextPage(response.data.paging.next);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const formatPath = (path) => path.join(" > ");
  const formatAudienceSize = (lower, upper) =>
    `${numeral(lower).format("0.0a")} - ${numeral(upper).format("0.0a")}`;

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Facebook Interests Search</h1>
        <button
          onClick={handleTokenChange}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {token ? "Change Token" : "Add Token"}
        </button>
      </header>
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
      {loading && <p>Loading...</p>}
      {data.length > 0 && (
        <>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-left">
                <th className="border py-2">Name</th>
                <th className="border py-2">Path</th>
                <th className="border py-2">Audience Size</th>
                <th className="border py-2">Topic</th>
                <th className="border py-2">Disambiguation Category</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
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
      )}
    </div>
  );
};

export default App;
