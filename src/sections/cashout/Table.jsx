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
    const [filteredData, setFilteredData] = useState([]);

    const table = useTable({
        defaultOrderBy: "user"
    });

    const notFound = !filteredData.length;

    useEffect(() => {
        axios
            .get(endpoints.cashout.list)
            .then((response) => {
                const { items } = response.data;

                setTableData(items);
                setFilteredData(items);
            })
            .catch((error) => {
                console.log("get cashout error : ", error);
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
                    {filteredData.length} CashOut Found
                </Typography>

                <Tooltip title="Search CashOut">
                    <TextField
                        variant="outlined"
                        onChange={(event) => handleSearch(event)}
                        label="Search CashOut"
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
                count={filteredData.length}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            />
        </>
    );
}

export default CashOutTable;