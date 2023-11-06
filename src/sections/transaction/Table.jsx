import { useState, useEffect, useCallback } from 'react';

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
	const [searchStr, setSearchStr] = useState("");
	const [currentPage, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(50);
	const [totalCount, setTotalCount] = useState(0);
	const [userData, setUserData] = useState([]);
	const [mounted, setMounted] = useState(false);

	const table = useTable({
		defaultOrderBy: "user"
	});

	const notFound = !totalCount;

	useEffect(() => {
		axios
			.get(endpoints.transaction.list, {
				params: {
					page: 1,
					size: 50
				}
			})
			.then((response) => {
				const { items, page, size, total } = response.data;

				setTableData(items);
				setPage(page - 1);
				setRowsPerPage(size);
				setTotalCount(total);
			})
			.catch((error) => {
				console.log("get transaction error : ", error);
			});

		getUserData();
	}, []);

	const getUserName = (id) => {
		let user = [];
		if (userData !== null && userData !== undefined) {
			user = userData.filter(item => item.id === id);
		}
		return user[0]?.customerName;
	}

	const getUserData = () => {
		axios
			.get(endpoints.user.list)
			.then((response) => {
				setUserData(response.data.items);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleSearch = (event) => {
		const searchValue = event.target.value.toLowerCase();
		setSearchStr(searchValue);
	}

	const onChangeRowsPerPage = (event) => {
		const { value } = event.target;

		setRowsPerPage(value);
		setPage(0);
	}

	const onChangePage = (event, newPage) => {
		setPage(newPage);
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const searchTransaction = useCallback(() => {
		axios
			.get(endpoints.transaction.search, {
				params: {
					search_query: searchStr,
					page: currentPage + 1,
					size: rowsPerPage
				}
			})
			.then((response) => {
				const { items, page, size, total } = response.data;

				setTableData(items);
				setPage(page - 1);
				setRowsPerPage(size);
				setTotalCount(total);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [currentPage, rowsPerPage, searchStr])

	useEffect(() => {
		setMounted(true)
	}, []);

	useEffect(() => {
		if (mounted) {
			searchTransaction();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, rowsPerPage, searchTransaction]);

	const handleKeyBoard = (keyBoard) => {
		if (keyBoard.key === "Enter" || keyBoard.code === "NumpadEnter") {
			searchTransaction();
		}
	}

	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
				<Typography variant="h6">
					{tableData.length} Transactions Found
				</Typography>

				<Tooltip title="Search Transaction">
					<TextField
						variant="outlined"
						onChange={(event) => handleSearch(event)}
						onKeyDown={handleKeyBoard}
						defaultValue={searchStr}
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
								tableData
									.map((row, index) => (
										<TableRow
											hover
											key={index}
											onClick={() => table.onSelectRow(row.name)}
										>
											<TableCell>{getUserName(row.user_id)}</TableCell>
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
				count={totalCount}
				page={currentPage}
				rowsPerPage={rowsPerPage}
				onPageChange={onChangePage}
				onRowsPerPageChange={onChangeRowsPerPage}
			/>
		</>
	);
}

export default TransactionTable;