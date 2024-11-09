// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FbInterestSearch from './tools/FbInterestSearch';
import BDJobs from './tools/BDJobs';
import SavedSets from './components/SavedSets';

export default function App() {
	return (
		<Router>
			<div className="container mx-auto p-5">
				<Routes>
					<Route path="/" element={<FbInterestSearch />} />
					<Route path="/saved-sets" element={<SavedSets />} />
				</Routes>
			</div>
		</Router>
	);
}
