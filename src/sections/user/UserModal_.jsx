import * as Yup from 'yup'
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect, forwardRef, useCallback } from "react";

import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axios, { endpoints } from 'src/utils/axios';

import FormProvider, {
    RHFSelect,
    RHFTextField
} from 'src/components/hook-form';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const UserModal = ({ dialog, type, user }) => {
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [webhook, setWebhook] = useState("");
    const [casinoWallet, setCasinoWallet] = useState("");
    const [withdrawWalletPrivateKey, setWithdrawWalletPrivateKey] = useState("");
    const [withdrawWalletAddress, setWithdrawWalletAddress] = useState("");
    const [agencyWalletAddress, setAgencyWalletAddress] = useState("");
    const [depositPercentageFee, setDepositPercentageFee] = useState(0);
    const [withdrawPercentageFee, setWithdrawPercentageFee] = useState(0);
    const [fixFee, setFixFee] = useState(0);
    const [userRole, setUserRole] = useState("USER");

    useEffect(() => {
        if (type === "Create") {
            setCustomerName("");
            setEmail("");
            setWebhook("");
            setUserRole("USER");
        } else if (type === "Update") {
            setCustomerName(user.customerName);
            setEmail(user.email);
            setWebhook(user.webhook);
            setUserRole(user.role);
        }
    }, [user, type]);

    const UserSchema = Yup.object().shape({
        // customerName: Yup.string().required('Customer Name is required'),
        // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        // webhook: Yup.string().required('Web Hook is required'),
        // password: Yup.string().required('Password is required'),
    });

    const userDefaultValues = {
        customerName,
        email,
        password,
        webhook,
        casinoWallet,
        withdrawWalletAddress,
        withdrawWalletPrivateKey,
        agencyWalletAddress,
        depositPercentageFee,
        withdrawPercentageFee,
        fixFee,
        userRole,
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
        console.log("submit data : ", data);
        if (type === "Created") {
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
        } else if (type === "craere") {
            axios
                .put(`${endpoints.user.list}/${user.id}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    console.log(response.data);
                    dialog.onFalse();
                })
                .catch(error => {
                    console.log("create user error : ", error);
                    reset();
                });
        }
    });

    const handleUserChange = useCallback((event) => {
        const { name, value } = event.target;

        const stateUpdateFunctions = {
            customerName: setCustomerName,
            email: setEmail,
            password: setPassword,
            webhook: setWebhook,
            casinoWallet: setCasinoWallet,
            withdrawWalletAddress: setWithdrawWalletAddress,
            withdrawWalletPrivateKey: setWithdrawWalletPrivateKey,
            agencyWalletAddress: setAgencyWalletAddress,
            depositPercentageFee: setDepositPercentageFee,
            withdrawPercentageFee: setWithdrawPercentageFee,
            fixFee: setFixFee,
            role: setUserRole
        };

        const setState = stateUpdateFunctions[name];
        if (setState) {
            setState(value);
        }
    }, []);

    return (
        <Dialog
            TransitionComponent={Transition}
            open={dialog.value}
            onClose={dialog.onFalse}>
            <DialogTitle>
                {type === "Create" ? "Create" : "Edit"} User
            </DialogTitle>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                autoFocus
                                fullWidth
                                type="text"
                                name='customerName'
                                margin="dense"
                                variant="outlined"
                                label="Customer Name"
                                onChange={(event) => handleUserChange(event)}
                                value={customerName}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                fullWidth
                                type="email"
                                name='email'
                                margin="dense"
                                variant="outlined"
                                label="Email Address"
                                onChange={(event) => handleUserChange(event)}
                                value={email}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                fullWidth
                                type="password"
                                name='password'
                                margin="dense"
                                variant="outlined"
                                label="Password"
                                onChange={(event) => handleUserChange(event)}
                                value={password}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                fullWidth
                                type="text"
                                name='webhook'
                                margin="dense"
                                variant="outlined"
                                label="Web Hook"
                                onChange={(event) => handleUserChange(event)}
                                value={webhook}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                fullWidth
                                type="text"
                                name='casinoWallet'
                                margin="dense"
                                variant="outlined"
                                label="Casino Wallet"
                                value={casinoWallet}
                                onChange={(event) => handleUserChange(event)}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                fullWidth
                                type="text"
                                name='withdrawWalletAddress'
                                margin="dense"
                                variant="outlined"
                                label="Withdraw Wallet Address"
                                value={withdrawWalletAddress}
                                onChange={(event) => handleUserChange(event)}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                fullWidth
                                type="text"
                                name='withdrawWalletPrivateKey'
                                margin="dense"
                                variant="outlined"
                                label="Withdraw Wallet PrivateKey"
                                value={withdrawWalletPrivateKey}
                                onChange={(event) => handleUserChange(event)}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                fullWidth
                                type="text"
                                name='agencyWalletAddress'
                                margin="dense"
                                variant="outlined"
                                label="Agency Wallet Address"
                                value={agencyWalletAddress}
                                onChange={(event) => handleUserChange(event)}
                            />
                        </Grid>
                        <Grid xs={12} md={4}>
                            <RHFTextField
                                fullWidth
                                type="number"
                                name='depositPercentageFee'
                                margin="dense"
                                variant="outlined"
                                label="Deposit Percentage Fee"
                                value={depositPercentageFee}
                                onChange={(event) => handleUserChange(event)}
                            />
                        </Grid>
                        <Grid xs={12} md={4}>
                            <RHFTextField
                                fullWidth
                                type="number"
                                name='withdrawPercentageFee'
                                margin="dense"
                                variant="outlined"
                                label="Withdraw Percentage Fee"
                                value={withdrawPercentageFee}
                                onChange={(event) => handleUserChange(event)}
                            />
                        </Grid>
                        <Grid xs={12} md={4}>
                            <RHFTextField
                                fullWidth
                                type="number"
                                name='fixFee'
                                margin="dense"
                                variant="outlined"
                                label="Fix Fee"
                                value={fixFee}
                                onChange={(event) => handleUserChange(event)}
                            />
                        </Grid>
                        <Grid xs={12} md={12}>
                            <RHFSelect
                                variant="outlined"
                                label="User Role"
                                name='role'
                                value={userRole}
                                onChange={(event) => handleUserChange(event)}
                            >
                                {[
                                    { value: "USER", label: "User" },
                                    { value: "ADMINISTRATOR", label: "Administrator" }
                                ].map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>
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
                        {type === "Create" ? "Create" : "Update"} User
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}

UserModal.propTypes = {
    dialog: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
}

export default UserModal;