import numeral from 'numeral';
import React, { useState } from 'react';
import { BsCheck2, BsCopy } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function DataTable({
	data,
	selectedKeywords,
	onSelect,
	loading,
}) {
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

	// Sorting logic
	const sortedData = React.useMemo(() => {
		let sortableItems = [...data];
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
	}, [data, sortConfig]);

	const requestSort = key => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	if (loading) {
		return (
			<div className="overflow-x-auto">
				<Skeleton count={5} height={40} className="my-4" />
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="table-auto w-full">
				<thead className="text-xs text-left text-gray-700 uppercase bg-gray-50">
					<tr>
						<th className="px-6 py-3">Select</th>
						<th
							className="px-6 py-3 cursor-pointer"
							onClick={() => requestSort('name')}
						>
							Name
						</th>
						<th
							className="px-6 py-3 cursor-pointer"
							onClick={() => requestSort('audience_size_upper_bound')}
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
						<th
							className="px-6 py-3 cursor-pointer"
							onClick={() => requestSort('disambiguation_category')}
						>
							Disambiguation Category
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{sortedData.map(item => (
						<tr key={item.id} className="text-sm text-gray-700">
							<td className="px-6 py-4 cursor-pointer">
								<input
									type="checkbox"
									checked={selectedKeywords.some(key => key.id === item.id)}
									onChange={() => onSelect(item)}
								/>
							</td>
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
							<td className="px-6 py-4">{`${numeral(
								item.audience_size_lower_bound
							).format('0a')}-${numeral(item.audience_size_upper_bound).format(
								'0a'
							)}`}</td>
							<td className="px-6 py-4">
								{item.path ? item.path.join(' > ') : ''}
							</td>
							<td className="px-6 py-4">{item.topic}</td>
							<td className="px-6 py-4">{item.disambiguation_category}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
