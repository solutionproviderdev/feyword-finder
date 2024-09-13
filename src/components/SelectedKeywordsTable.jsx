import numeral from 'numeral';
import React, { useState } from 'react';
import { BsCheck2, BsCopy, BsTrash3 } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SelectedKeywordsTable = ({ selectedKeywords, handleRemove }) => {
	const [copiedText, setCopiedText] = useState(null);

	// Copy to clipboard
	const handleCopy = text => {
		navigator.clipboard.writeText(text);
		setCopiedText(text);
		const timer = setTimeout(() => setCopiedText(null), 1000);
		return () => clearTimeout(timer);
	};

	if (selectedKeywords.length === 0) {
		return <Skeleton count={5} height={40} className="my-4" />;
	}

	return (
		<div className="mt-4">
			<h2 className="text-xl font-bold mb-2">Selected Keywords</h2>
			<div className="overflow-x-auto">
				<table className="table-auto w-full">
					<thead className="text-xs text-left text-gray-700 uppercase bg-gray-50">
						<tr>
							<th className="px-6 py-3">Name</th>
							<th className="px-6 py-3">Audience Size</th>
							<th className="px-6 py-3">Path</th>
							<th className="px-6 py-3">Topic</th>
							<th className="px-6 py-3">Delete</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{selectedKeywords.map(item => (
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
								<td className="px-6 py-4">{`${numeral(
									item.audience_size_lower_bound
								).format('0a')}-${numeral(
									item.audience_size_upper_bound
								).format('0a')}`}</td>
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
