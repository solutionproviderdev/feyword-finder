// SelectedKeywordsTable.js
import React, { useState } from 'react';
import { BsCheck2, BsCopy, BsTrash3 } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import numeral from 'numeral';

const SelectedKeywordsTable = ({ selectedKeywords, handleRemove }) => {
	const [copiedText, setCopiedText] = useState(null);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: 'ascending',
	});

	// Copy to clipboard
	const handleCopy = text => {
		navigator.clipboard.writeText(text);
		setCopiedText(text);
		const timer = setTimeout(() => setCopiedText(null), 1000);
		return () => clearTimeout(timer);
	};

	// Sorting logic specific to this table
	const sortedSelectedKeywords = React.useMemo(() => {
		let sortableItems = [...selectedKeywords];
		if (sortConfig.key !== null) {
			sortableItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [selectedKeywords, sortConfig]);

	const requestSort = key => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	if (selectedKeywords.length === 0) {
		return <Skeleton count={5} height={40} className="my-4" />;
	}

	return (
		<div className="mt-4">
			<h2 className="text-xl font-bold mb-4">Selected Keywords</h2>
			<div className="overflow-x-auto">
				<table className="table-auto w-full">
					<thead className="text-xs text-left text-gray-700 uppercase bg-gray-50">
						<tr>
							<th
								className="px-6 py-3 cursor-pointer"
								onClick={() => requestSort('name')}
							>
								Name
							</th>
							<th
								className="px-6 py-3 cursor-pointer"
								onClick={() => requestSort('audience_size_lower_bound')}
							>
								Audience Size
							</th>
							<th
								className="px-6 py-3 cursor-pointer"
								onClick={() => requestSort('path')}
							>
								Path
							</th>
							<th
								className="px-6 py-3 cursor-pointer"
								onClick={() => requestSort('topic')}
							>
								Topic
							</th>
							<th className="px-6 py-3">Delete</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{sortedSelectedKeywords.map(item => (
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
									{`${numeral(item.audience_size_lower_bound).format(
										'0a'
									)}-${numeral(item.audience_size_upper_bound).format('0a')}`}
								</td>
								<td className="px-6 py-4">
									{item.path ? item.path.join(' > ') : ''}
								</td>
								<td className="px-6 py-4">{item.topic}</td>
								<td
									className="px-6 py-4 cursor-pointer"
									onClick={() => handleRemove(item.id)}
								>
									<BsTrash3 />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SelectedKeywordsTable;
