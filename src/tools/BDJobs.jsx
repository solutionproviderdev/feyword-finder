import React, { useState, useEffect } from "react";
import axios from "axios";
import applicantsData from "../data/BDjobsApplicents.json";
import applicantsData2 from "../data/BDjobsApplicents2.json";

function BDJobs() {
  const [applicants, setApplicants] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    // Combine old and new data, filtering out duplicates based on ApplyID
    const oldApplicants = applicantsData.Applicants;
    const newApplicants = applicantsData2.Applicants;

    const filteredNewApplicants = newApplicants.filter(
      (newApplicant) =>
        !oldApplicants.some(
          (oldApplicant) => oldApplicant.ApplyID === newApplicant.ApplyID
        )
    );

    // Set the applicants state with combined unique applicants
    setApplicants([...filteredNewApplicants]);
  }, []);

  const sortedApplicants = React.useMemo(() => {
    let sortableItems = [...applicants];
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
  }, [applicants, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter applicants whose location includes "Dhaka"
  const filteredApplicants = React.useMemo(() => {
    return sortedApplicants.filter((applicant) =>
      applicant.ApplicantLocation.includes("Dhaka")
    );
  }, [sortedApplicants]);

  return (
    <div className="App p-5">
      <h1 className="text-2xl font-bold text-center mb-5">
        CRE Job Applicants
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("index")}
              >
                No.
              </th>
              <th className="px-6 py-3">Photo</th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Name")}
              >
                Name
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Age")}
              >
                Age
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Email")}
              >
                Email
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Mobile")}
              >
                Phone
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("ApplicantLocation")}
              >
                Location
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("AppliedDate")}
              >
                Application Date
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Exp")}
              >
                Experience
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("ApplicantCurrentSalary")}
              >
                Current Salary
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Salary")}
              >
                Expected Salary
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplicants.map((applicant, index) => (
              <tr key={applicant.ApplyID} className="text-sm text-gray-700">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={applicant.Photo}
                    alt="Profile"
                    className="h-12 w-12 rounded-full"
                  />
                </td>
                <td className="px-6 py-4">{applicant.Name}</td>
                <td className="px-6 py-4">{applicant.Age}</td>
                <td className="px-6 py-4">{applicant.Email}</td>
                <td className="px-6 py-4">{applicant.Mobile}</td>
                <td className="px-6 py-4">{applicant.ApplicantLocation}</td>
                <td className="px-6 py-4">{applicant.AppliedDate}</td>
                <td className="px-6 py-4">{applicant.Exp}</td>
                <td className="px-6 py-4">
                  {applicant.ApplicantCurrentSalary}
                </td>
                <td className="px-6 py-4">{applicant.Salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BDJobs;
