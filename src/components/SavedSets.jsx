// SavedSets.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SelectedKeywordsTable from '../components/SelectedKeywordsTable';

const SavedSets = () => {
	const [savedSets, setSavedSets] = useState([]);
	const [selectedSet, setSelectedSet] = useState(null); // Track selected set

	useEffect(() => {
		const sets = JSON.parse(localStorage.getItem('savedKeywordSets')) || [];
		setSavedSets(sets);
	}, []);

	const handleSelectSet = set => {
		setSelectedSet(selectedSet === set ? null : set); // Toggle selected set
	};

	if (savedSets.length === 0) {
		return <p className="text-center text-gray-500">No saved sets found.</p>;
	}

	return (
		<div className="container mx-auto p-5">
			<div className="flex items-center justify-between mb-5">
				<h1 className="text-2xl font-bold">Saved Keyword Sets</h1>
				<Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
					FB Interest Search
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{savedSets.map((set, index) => (
					<div
						key={index}
						className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
						onClick={() => handleSelectSet(set)}
					>
						<h2 className="text-lg font-semibold">{set.name}</h2>
						<p className="text-sm text-gray-500">
							Saved on: {new Date(set.timestamp).toLocaleString()}
						</p>
						<p className="text-sm text-gray-500">
							Keywords Count: {set.keywords.length}
						</p>
					</div>
				))}
			</div>

			{/* Show selected keywords table when a set is selected */}
			{selectedSet && (
				<div className="mt-6">
					<h2 className="text-xl font-bold mb-4">
						Keywords in "{selectedSet.name}"
					</h2>
					<SelectedKeywordsTable
						selectedKeywords={selectedSet.keywords}
						handleRemove={() => {}}
					/>
				</div>
			)}
		</div>
	);
};

export default SavedSets;
