import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import axios, { endpoints } from 'src/utils/axios';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify/iconify';

const ProfileTable = () => {
    const [profileData, setProfileData] = useState([]);

    useEffect(() => {
        axios
            .get(endpoints.profile.list)
            .then((response) => {
                setProfileData(response.data);
            })
            .catch((error) => {
                console.log("get profile data error : ", error);
            });
    }, []);

    return (
        <>
            <Card sx={{ width: 1 }}>
                <Stack alignItems="left" justifyContent="space-between" sx={{ p: 3 }}>
                    <Typography gutterBottom variant="subtitle1" sx={{ color: "text.primary" }}>
                        Personal Info
                    </Typography>
                    <Typography gutterBottom variant="body2" sx={{ color: "text.primary" }}>
                        Below are the username, email and overview information for your account.
                    </Typography>
                </Stack>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size="medium" sx={{ minWidth: 800 }}>
                            <TableBody>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:account-circle-outline" width={16} />
                                            Your username:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">
                                        {profileData.customerName}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:email-outline" width={16} />
                                            Your Email Address:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">
                                        {profileData.email}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:security" width={16} />
                                            Your Role:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.role}</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:clipboard-text-clock-outline" width={16} />
                                            Created Date:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.created_at}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>
            </Card>
            <Card sx={{ width: 1 }}>
                <Stack alignItems="left" justifyContent="space-between" sx={{ p: 3 }}>
                    <Typography gutterBottom variant="subtitle1" sx={{ color: "text.primary" }}>
                        Overview Usage
                    </Typography>
                    <Typography gutterBottom variant="body2" sx={{ color: "text.primary" }}>
                        Usage of account features such as Webhook, total in amount, and total out amount ...
                    </Typography>
                </Stack>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size="medium" sx={{ minWidth: 800 }}>
                            <TableBody>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:webhook" width={16} />
                                            Web Hook:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.webhook}</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:home-import-outline" width={16} />
                                            Total In:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.total_in}</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:home-export-outline" width={16} />
                                            Total Out:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.total_out}</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:cash-fast" width={16} />
                                            Deposit Energy:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.deposit_energy}</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:account-credit-card-outline" width={16} />
                                            Withdraw Energy:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.withdraw_energy}</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell align="left">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Iconify icon="mdi:delete-empty-outline" width={16} />
                                            Total Empty:
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{profileData.emptyTotal}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>
            </Card>
        </>
    );
}

export default ProfileTable;