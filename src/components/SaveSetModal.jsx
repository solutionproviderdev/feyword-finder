// SaveSetModal.js
import React, { useState } from 'react';

const SaveSetModal = ({ isOpen, onClose, onSave }) => {
	const [setName, setSetName] = useState('');

	const handleSave = () => {
		onSave(setName);
		setSetName(''); // Clear input after saving
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
			<div className="bg-white p-6 rounded shadow-lg">
				<h3 className="text-lg font-bold mb-4">Save Selected Keywords</h3>
				<input
					type="text"
					placeholder="Enter a name for this set"
					value={setName}
					onChange={e => setSetName(e.target.value)}
					className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
				/>
				<div className="flex justify-end">
					<button
						className="bg-green-500 text-white px-4 py-2 rounded mr-2"
						onClick={handleSave}
					>
						Save
					</button>
					<button
						className="bg-red-500 text-white px-4 py-2 rounded"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default SaveSetModal;
