import React, { useState, useEffect } from 'react';
import './Table.scss';

const Table = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const dataPerPAge = 10;
	const [maxPageCount, setMaxPageCount] = useState(0);
	const [showData, setShowData] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchedData, setSearchedData] = useState([]);
	useEffect(() => {
		setLoading(true);
		fetch('./api/data.json')
			.then((res) => res.json())
			.then((data) => {
				const tableData = data.data;
				setData(tableData);
				setMaxPageCount(Math.ceil(data.data.length / dataPerPAge));
				setShowData(tableData.slice(0, 10));
				setLoading(false);
			});
	}, []);
	useEffect(() => {
		getPageData();
	}, [page]);

	const getPageData = () => {
		const all = [...data];
		const showData = all.slice(page * 10, page * 10 + 10);
		setShowData(showData);
	};
	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (searchTerm !== '') {
				const searchData = data.filter((item) => {
					if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
						return item;
					}
				});
				setSearchedData(searchData);
			} else {
				setSearchedData([]);
			}
		}, 3000);

		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm, data]);
	return (
		<div>
			{loading ? (
				'Loading'
			) : (
				<div>
					<div className="input-container">
						<input placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
					</div>
					<table className="json-table">
						<thead>
							<tr className="header">
								<th>Type</th>
								<th>Category Name</th>
								<th>Company</th>
							</tr>
						</thead>
						<tbody>
							{searchedData.length === 0 && searchTerm === '' ? (
								<>
									{data &&
										showData.map((item) => (
											<tr className="" key={item.id}>
												<td>{item.type}</td>
												<td>{item.name}</td>
												<td>{item.company}</td>
											</tr>
										))}
								</>
							) : (
								<>
									{searchedData.length === 0 && searchTerm != '' ? (
										<tr>
											<td colSpan={3} style={{ textAlign: 'center' }}>
												No results found
											</td>
										</tr>
									) : (
										<>
											{searchedData.map((item) => (
												<tr className="" key={item.id}>
													<td>{item.type}</td>
													<td>{item.name}</td>
													<td>{item.company}</td>
												</tr>
											))}
										</>
									)}
								</>
							)}
						</tbody>
					</table>
				</div>
			)}
			{searchTerm === '' && searchedData.length === 0 ? (
				<div className="pagination-button-holder">
					<button
						onClick={() => {
							if (page > 0) {
								setPage(page - 1);
							}
						}}
					>
						Previous
					</button>
					<button
						onClick={() => {
							if (maxPageCount - 2 >= page) {
								setPage(page + 1);
							}
						}}
					>
						Next
					</button>
				</div>
			) : null}
		</div>
	);
};

export default Table;
