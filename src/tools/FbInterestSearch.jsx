// FbInterestSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectedKeywordsTable from '../components/SelectedKeywordsTable';
import DataTable from '../components/DataTable';
import SaveSetModal from '../components/SaveSetModal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi'; // Import the search icon

const FbInterestSearch = () => {
	const [query, setQuery] = useState('');
	const [data, setData] = useState([]);
	const [token, setToken] = useState(
		'EAA0vg38JGXIBO87AovybuzZBmTlkgV05wOAoEBces2yQYmYRtSB2P2yyZAvVL88dCYCDy4apmSZC78Ec2ZCvC3GEt2sB0NjrAGdZBA4FXpQnm08A7MCmTJN4YrLh65EJSLadrSF9XkA4ER6Ew3h85l0758j13sZAU1gz2ZBPPUqMywDBxVTPIgsJAJmddKTV2CgdMHRsy3LYIxywLzrmwZDZD'
	);
	const [loading, setLoading] = useState(false);
	const [nextPage, setNextPage] = useState('');
	const [selectedKeywords, setSelectedKeywords] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const savedToken = localStorage.getItem('fb_access_token');
		if (savedToken) {
			setToken(savedToken);
		}
	}, []);

	const handleTokenChange = () => {
		const newToken = prompt('Please enter your access token');
		if (newToken) {
			setToken(newToken);
			localStorage.setItem('fb_access_token', newToken);
		}
	};

	// query and get data
	const handleSearch = async (next = false) => {
		if (!token) {
			alert('Please add your access token first.');
			return;
		}
		setLoading(true);
		try {
			const params = {
				type: 'adinterest',
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
			console.error('Error fetching data:', error);
		}
		setLoading(false);
	};

	// Save selected keywords to local storage
	const saveSetToLocalStorage = setName => {
		const timestamp = new Date().toISOString();
		const savedSets =
			JSON.parse(localStorage.getItem('savedKeywordSets')) || [];
		const newSet = {
			name: setName,
			timestamp,
			keywords: selectedKeywords,
		};
		localStorage.setItem(
			'savedKeywordSets',
			JSON.stringify([...savedSets, newSet])
		);
		alert('Set saved successfully!');
	};

	// Add to selected table
	const handleSelect = keyword => {
		setSelectedKeywords(prev =>
			prev.some(key => key.id === keyword.id)
				? prev.filter(key => key.id !== keyword.id)
				: [...prev, keyword]
		);
	};

	// remove from selected table
	const handleRemove = id => {
		setSelectedKeywords(prev => prev.filter(key => key.id !== id));
	};

	return (
		<div className="container mx-auto p-5">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-center mb-5">
					FB Interest Search
				</h1>
				<Link
					to="/saved-sets"
					className="bg-green-500 text-white px-4 py-2 rounded"
				>
					Saved Sets
				</Link>
			</div>
			<div className="flex items-center justify-center mb-4">
				<div className="flex items-center bg-white shadow-md rounded-full w-full max-w-3xl">
					{' '}
					{/* Updated width to full and max width */}
					<input
						type="text"
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder="Search interests..."
						className="px-4 py-3 w-full rounded-full focus:outline-none text-gray-700"
						onKeyDown={e => e.key === 'Enter' && handleSearch()}
					/>
					<button className="text-gray-500 pr-4" onClick={() => handleSearch()}>
						<BiSearch className="text-xl" /> {/* Use BiSearch icon */}
					</button>
				</div>
			</div>

			{selectedKeywords.length > 0 && (
				<div className="">
					<SelectedKeywordsTable
						selectedKeywords={selectedKeywords}
						handleRemove={handleRemove}
					/>
					<button
						className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded"
						onClick={() => setIsModalOpen(true)}
					>
						Save the Set
					</button>
				</div>
			)}

			{loading ? (
				<Skeleton count={5} height={40} className="my-4" />
			) : (
				<>
					{data.length > 0 ? (
						<>
							<h2 className="text-xl font-semibold mt-6 mb-4">
								Search Results
							</h2>
							<DataTable
								data={data} // Pass your array of objects
								selectedKeywords={selectedKeywords} // Pass the selected keywords
								onSelect={handleSelect} // Handle item selection
								loading={false} // Set loading state
							/>
						</>
					) : (
						<p className="text-center text-gray-500">
							No data found. Please try a different search term.
						</p>
					)}
				</>
			)}

			<SaveSetModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={saveSetToLocalStorage}
			/>
		</div>
	);
};

export default FbInterestSearch;
