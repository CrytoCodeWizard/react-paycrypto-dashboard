import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';

import axios, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
	useTable,
	emptyRows,
	TableNoData,
	TableEmptyRows,
	TableHeadCustom,
	TablePaginationCustom,
} from 'src/components/table';

const TABLE_HEAD = [
	{ id: 'user', label: 'User' },
	{ id: 'address', label: 'Address', align: 'left' },
	{ id: 'transHash', label: 'Transaction Hash', align: 'left' },
	{ id: 'amount', label: 'Amount', align: 'left' }
];

const TransactionTable = () => {
	const [tableData, setTableData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);

	const table = useTable({
		defaultOrderBy: "user"
	});

	const notFound = !filteredData.length;

	useEffect(() => {
		axios
			.get(endpoints.transaction.list)
			.then((response) => {
				const { items } = response.data;

				setTableData(items);
				setFilteredData(items);
			})
			.catch((error) => {
				console.log("get transaction error : ", error);
			});
	}, []);

	const handleSearch = (event) => {
		const searchValue = event.target.value.toLowerCase();

		const tempData = tableData.filter(data =>
			data.user_id.toString().toLowerCase().includes(searchValue));

		setFilteredData(tempData);
	}

	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
				<Typography variant="h6">
					{filteredData.length} Transactions Found
				</Typography>

				<Tooltip title="Search Transaction">
					<TextField
						variant="outlined"
						onChange={(event) => handleSearch(event)}
						label="Search Transaction"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Iconify icon="ic:search" width={24} />
								</InputAdornment>
							),
						}}
					/>
				</Tooltip>
			</Stack>
			<TableContainer sx={{ mt: 3, position: 'relative', overflow: 'unset' }}>
				<Scrollbar>
					<Table size="small" sx={{ minWidth: 800 }}>
						<TableHeadCustom headLabel={TABLE_HEAD} />

						<TableBody>
							{
								filteredData
									.slice(
										table.page * table.rowsPerPage,
										table.page * table.rowsPerPage + table.rowsPerPage
									)
									.map((row, index) => (
										<TableRow
											hover
											key={index}
											onClick={() => table.onSelectRow(row.name)}
										>
											<TableCell>{row.user_id}</TableCell>
											<TableCell align="left">{row.address_id}</TableCell>
											<TableCell align="left">{row.transaction_hash}</TableCell>
											<TableCell align="left">{row.amount}</TableCell>
										</TableRow>
									))
							}
							<TableEmptyRows
								emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
							/>

							<TableNoData notFound={notFound} title="Transaction" />
						</TableBody>
					</Table>
				</Scrollbar>
			</TableContainer>
			<TablePaginationCustom
				count={filteredData.length}
				page={table.page}
				rowsPerPage={table.rowsPerPage}
				onPageChange={table.onChangePage}
				onRowsPerPageChange={table.onChangeRowsPerPage}
			/>
		</>
	);
}

export default TransactionTable;