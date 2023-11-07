import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import axios, { endpoints } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';

import AppWelcome from './app-welcome';
import AppWidgetSummary from './app-widget-summary';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const settings = useSettingsContext();
  const theme = useTheme();
  // const { user } = useAuthContext();
  // console.log("user info :", user);
  useEffect(() => {
    axios
      .get(endpoints.profile.list)
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.log("profile info error : ", error);
      })
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={1}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`Welcome back 👋 ${userInfo?.customerName}`}
          // img={<SeoIllustration />}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total In"
            percent={0}
            total={userInfo?.total_in}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Out"
            percent={0}
            total={userInfo?.total_out}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Empty"
            percent={0}
            total={userInfo?.emptyTotal}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <AppWidgetSummary
            title="Deposit Energy"
            percent={0}
            total={userInfo?.deposit_energy}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <AppWidgetSummary
            title="Withdraw Energy"
            percent={0}
            total={userInfo?.withdraw_energy}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;