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
    { id: 'total_in', label: 'Total In', align: 'left' },
    { id: 'total_out', label: 'Total Out', align: 'left' },
    { id: 'deposit_energy', label: 'Deposit Energy', align: 'left' },
    { id: 'withdraw_energy', label: 'Withdraw Energy', align: 'left' },
    { id: 'empty_total', label: 'Empty Total', align: 'left' },
    { id: 'casino_hash', label: 'Casino Hash', align: 'left' },
    { id: 'agency_hash', label: 'Agency Hash', align: 'left' },
    { id: 'withdrawal_hash', label: 'Withdrawal Hash', align: 'left' },
    { id: 'status', label: 'status', align: 'left' },
    { id: 'created_date', label: 'Create At', align: 'left' }
];

const CashOutTable = () => {
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
            .get(endpoints.cashout.list, {
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
                console.log("get cashout error : ", error);
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
        console.log("change page: ", newPage);
    }

    const searchCashOut = useCallback(() => {
        axios
            .get(endpoints.cashout.search, {
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
    }, [searchStr, rowsPerPage, currentPage]);

    useEffect(() => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (mounted) {
            searchCashOut();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowsPerPage, currentPage, searchCashOut]);

    const handleKeyBoard = (keyBoard) => {
        if (keyBoard.key === "Enter" || keyBoard.code === "NumpadEnter") {
            searchCashOut();
        }
    }

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
                <Typography variant="h6">
                    {tableData.length} CashOut Found
                </Typography>

                <Tooltip title="Search CashOut">
                    <TextField
                        variant="outlined"
                        onChange={(event) => handleSearch(event)}
                        label="Search CashOut"
                        defaultValue={searchStr}
                        onKeyDown={handleKeyBoard}
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
                                            <TableCell align="left">{row.total_in}</TableCell>
                                            <TableCell align="left">{row.total_out}</TableCell>
                                            <TableCell align="left">{row.deposit_energy}</TableCell>
                                            <TableCell align="left">{row.withdraw_energy}</TableCell>
                                            <TableCell align="left">{row.emptyTotal}</TableCell>
                                            <TableCell align="left">{row.casino_hash}</TableCell>
                                            <TableCell align="left">{row.agency_hash}</TableCell>
                                            <TableCell align="left">{row.withdrawal_hash}</TableCell>
                                            <TableCell align="left">{row.status}</TableCell>
                                            <TableCell align="left">{row.created_date}</TableCell>
                                        </TableRow>
                                    ))
                            }
                            <TableEmptyRows
                                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                            />

                            <TableNoData notFound={notFound} title="CashOut" />
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

export default CashOutTable;