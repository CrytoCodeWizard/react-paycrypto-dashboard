import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import {
    useTable,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';

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
    { id: 'createdAt', label: 'Created Date', align: 'left' }
];

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const UserTable = () => {
    const [tableData, setTableData] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [currentPage, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [totalCount, setTotalCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    // const [userRole, setUserRole] = useState("USER");

    const dialog = useBoolean();
    const table = useTable({
        defaultOrderBy: "user"
    });

    const UserSchema = Yup.object().shape({
        customerName: Yup.string().required('Customer Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        password: Yup.string().required('Password is required'),
        webhook: Yup.string().required('Web Hook is required'),
        casinoWallet: Yup.string().required('Casino Wallet is required'),
        withdrawWalletAddress: Yup.string().required('Withdraw Wallet Address is required'),
        withdrawWalletPrivateKey: Yup.string().required('Withdraw Wallet PrivateKey is required'),
        agencyWalletAddress: Yup.string().required('Agency Wallet Address is required'),
        depositPercentageFee: Yup.string().required('Deposit Percentage Fee is required'),
        withdrawPercentageFee: Yup.string().required('Withdraw Percentage Fee is required'),
        fixFee: Yup.string().required('Fix fee is required')
    });

    const userDefaultValues = {
        customerName: "",
        email: "",
        password: "",
        webhook: "",
        casinoWallet: "",
        withdrawWalletAddress: "",
        withdrawWalletPrivateKey: "",
        agencyWalletAddress: "",
        depositPercentageFee: 0,
        withdrawPercentageFee: 0,
        fixFee: 0,
        role: "USER"
    }

    const methods = useForm({
        resolver: yupResolver(UserSchema),
        userDefaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit((data) => {
        console.log("create user data : ", data);
        axios
            .post(endpoints.user.list, data)
            .then(response => {
                console.log(response.data);
                dialog.onFalse();
            })
            .catch(error => {
                console.log("create user error : ", error);
                reset();
            });
    });

    // const handleChangeUserRole = useCallback((event) => {
    //     setUserRole(event.target.value);
    // }, []);

    const notFound = !totalCount;
    // console.log("role ", userRole);
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
                    <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ mx: 1 }}>
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
                                            key={index}
                                            onClick={() => table.onSelectRow(row.name)}
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
            <Dialog
                TransitionComponent={Transition}
                open={dialog.value}
                onClose={dialog.onFalse}>
                <DialogTitle>Create User</DialogTitle>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    name='customerName'
                                    margin="dense"
                                    variant="outlined"
                                    label="Customer Name"
                                />
                            </Grid>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="email"
                                    name='email'
                                    margin="dense"
                                    variant="outlined"
                                    label="Email Address"
                                />
                            </Grid>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="password"
                                    name='password'
                                    margin="dense"
                                    variant="outlined"
                                    label="Password"
                                />
                            </Grid>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    name='webhook'
                                    margin="dense"
                                    variant="outlined"
                                    label="Web Hook"
                                />
                            </Grid>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    name='casinoWallet'
                                    margin="dense"
                                    variant="outlined"
                                    label="Casino Wallet"
                                />
                            </Grid>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    name='withdrawWalletAddress'
                                    margin="dense"
                                    variant="outlined"
                                    label="Withdraw Wallet Address"
                                />
                            </Grid>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    name='withdrawWalletPrivateKey'
                                    margin="dense"
                                    variant="outlined"
                                    label="Withdraw Wallet PrivateKey"
                                />
                            </Grid>
                            <Grid xs={12} md={12}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    name='agencyWalletAddress'
                                    margin="dense"
                                    variant="outlined"
                                    label="Agency Wallet Address"
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="number"
                                    name='depositPercentageFee'
                                    margin="dense"
                                    variant="outlined"
                                    label="Deposit Percentage Fee"
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="number"
                                    name='withdrawPercentageFee'
                                    margin="dense"
                                    variant="outlined"
                                    label="Withdraw Percentage Fee"
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="number"
                                    name='fixFee'
                                    margin="dense"
                                    variant="outlined"
                                    label="Fix Fee"
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <RHFTextField
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    name='role'
                                    margin="dense"
                                    variant="outlined"
                                    label="Fix Fee"
                                    defaultValue="USER"
                                />
                            </Grid>
                            {/* <Grid xs={12} md={12}>
                                <RHFSelect
                                    variant="outlined"
                                    label="User Role"
                                    name='role'
                                    value={userRole}
                                    onChange={handleChangeUserRole}
                                >
                                    {[{ value: "USER" }, { value: "ADMINISTRATOR" }].map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid> */}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={dialog.onFalse} variant="outlined" color="warning">
                            Cancel
                        </Button>
                        <LoadingButton
                            color="success"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            Create User
                        </LoadingButton>
                    </DialogActions>
                </FormProvider>
            </Dialog>
        </>
    );
}

export default UserTable;