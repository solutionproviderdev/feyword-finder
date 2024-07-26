import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectedKeywordsTable from "../components/SelectedKeywordsTable";
import DataTable from "../components/DataTable";

const FbInterestSearch = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [token, setToken] = useState(
    "EAA0vg38JGXIBO87AovybuzZBmTlkgV05wOAoEBces2yQYmYRtSB2P2yyZAvVL88dCYCDy4apmSZC78Ec2ZCvC3GEt2sB0NjrAGdZBA4FXpQnm08A7MCmTJN4YrLh65EJSLadrSF9XkA4ER6Ew3h85l0758j13sZAU1gz2ZBPPUqMywDBxVTPIgsJAJmddKTV2CgdMHRsy3LYIxywLzrmwZDZD"
  );
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [limit, setLimit] = useState(25);
  const [mode, setMode] = useState("interest");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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

  // query and get data
  const handleSearch = async (next = false) => {
    if (!token) {
      alert("Please add your access token first.");
      return;
    }
    setLoading(true);
    try {
      const params = {
        type: mode === "interest" ? "adinterest" : "adinterestsuggestion",
        q: query,
        access_token: token,
        limit: 250,
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

  const handleSelect = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.some((key) => key.id === keyword.id)
        ? prev.filter((key) => key.id !== keyword.id)
        : [...prev, keyword]
    );
  };

  // Sorting
  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold text-center mb-5">
        FB Interest Search
      </h1>
      <div className="flex items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          onClick={handleTokenChange}
        >
          Change Token
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search interests..."
          className="border border-gray-300 px-4 py-2 rounded w-full"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
          onClick={() => handleSearch()}
        >
          Search
        </button>
      </div>

      {selectedKeywords.length > 0 && (
        <SelectedKeywordsTable
          selectedKeywords={selectedKeywords}
          // onCopy={handleCopy}
        />
      )}

      {loading && <p>Loading...</p>}

      {sortedData.length > 0 && (
        <DataTable
          data={sortedData}
          requestSort={requestSort}
          selectedKeywords={selectedKeywords}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

export default FbInterestSearch;
