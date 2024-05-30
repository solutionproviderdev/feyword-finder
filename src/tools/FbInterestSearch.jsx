import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import ResultsTable from "../components/ResultsTable";
import SearchBar from "../components/SearchBar";

const FbInterestSearch = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [limit, setLimit] = useState(25);
  const [mode, setMode] = useState("interest");
  const [selectedKeywords, setSelectedKeywords] = useState([]);

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

  const handleSelect = (id) => {
    setSelectedKeywords((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Header handleTokenChange={handleTokenChange} token={token} />
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        mode={mode}
        setMode={setMode}
      />

      {/* Filter section with the limit setter and ammount of response info.   */}
      {loading && <p>Loading...</p>}
      {data.length > 0 && (
        <ResultsTable
          data={data}
          handleSearch={handleSearch}
          nextPage={nextPage}
          handleSelect={handleSelect}
        />
      )}
      {selectedKeywords.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Selected Keywords</h2>
          <ul>
            {selectedKeywords.map((id) => {
              const keyword = data.find((item) => item.id === id);
              return <li key={id}>{keyword ? keyword.name : "Unknown"}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FbInterestSearch;
