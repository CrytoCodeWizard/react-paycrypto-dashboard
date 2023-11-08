import { useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

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

import UserModal from "./UserModal";

const TABLE_HEAD = [
    { id: 'user', label: 'Name' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'webhook', label: 'Web Hook', align: 'left' },
    { id: 'role', label: 'Role', align: 'left' },
    { id: 'totalIn', label: 'Total In', align: 'left' },
    { id: 'totalOut', label: 'Total Out', align: 'left' },
    { id: 'depositEnergy', label: 'Deposit Energy', align: 'left' },
    { id: 'withdrawEnergy', label: 'Withdraw Energy', align: 'left' },
    { id: 'emptyTotal', label: 'Empty Total', align: 'left' },
    { id: 'createdAt', label: 'Created Date', align: 'left' },
    { id: 'update', label: 'Edit', align: 'left' }
];

const UserTable = () => {
    const [tableData, setTableData] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [currentPage, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [totalCount, setTotalCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [modalType, setModalType] = useState("Create");
    const [modalData, setModalData] = useState({});
    // const [userRole, setUserRole] = useState("USER");

    const updateDialog = useBoolean();
    const dialog = useBoolean();

    const table = useTable({
        defaultOrderBy: "user"
    });

    const notFound = !totalCount;

    const openCreateModal = () => {
        dialog.onTrue();
        setModalType("Create");
    }

    const openEditModal = (data) => {
        dialog.onTrue();
        setModalType("Update");
        setModalData(data);
    }

    useEffect(() => {
        axios
            .get(endpoints.user.list, {
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
                console.log("get user error : ", error);
            });
    }, []);

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
    const searchUser = useCallback(() => {
        axios
            .get(endpoints.user.search, {
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
            searchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rowsPerPage, searchUser]);

    const handleKeyBoard = (keyBoard) => {
        if (keyBoard.key === "Enter" || keyBoard.code === "NumpadEnter") {
            searchUser();
        }
    }

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                <Typography variant="h6">
                    {tableData.length} Users Found
                </Typography>
                <Stack direction="row" alignItems="initial" justifyContent="space-between">
                    <Tooltip title="Search User" sx={{ mx: 1 }}>
                        <TextField
                            variant="outlined"
                            onChange={(event) => handleSearch(event)}
                            onKeyDown={handleKeyBoard}
                            defaultValue={searchStr}
                            label="Search User"
                            size='small'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="ic:search" width={24} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Tooltip>
                    <Button variant="outlined" color="success" onClick={() => openCreateModal()} sx={{ mx: 1 }}>
                        Create User
                    </Button>
                </Stack>
            </Stack>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                    <Table size="small" sx={{ minWidth: 800 }}>
                        <TableHeadCustom headLabel={TABLE_HEAD} />

                        <TableBody>
                            {
                                tableData
                                    .map((row, index) => (
                                        <TableRow
                                            hover
                                            sx={{ cursor: "pointer" }}
                                            key={index}
                                            onClick={() => updateDialog.onTrue}
                                        >
                                            <TableCell>{row.customerName}</TableCell>
                                            <TableCell align="left">{row.email}</TableCell>
                                            <TableCell align="left">{row.webhook}</TableCell>
                                            <TableCell align="left">{row.role}</TableCell>
                                            <TableCell align="left">{row.total_in}</TableCell>
                                            <TableCell align="left">{row.total_out}</TableCell>
                                            <TableCell align="left">{row.deposit_energy}</TableCell>
                                            <TableCell align="left">{row.withdraw_energy}</TableCell>
                                            <TableCell align="left">{row.emptyTotal}</TableCell>
                                            <TableCell align="left">{row.created_at}</TableCell>
                                            <TableCell align="left" onClick={() => openEditModal(row)}>
                                                <Iconify icon="fa-regular:edit" width={24} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                            <TableEmptyRows
                                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                            />

                            <TableNoData notFound={notFound} title="User" />
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

            <UserModal
                dialog={dialog}
                type={modalType}
                user={modalData} />
        </>
    );
}

export default UserTable;