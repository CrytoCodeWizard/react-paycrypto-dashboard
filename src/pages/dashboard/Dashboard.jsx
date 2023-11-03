import { Helmet } from 'react-helmet-async';

import Home from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

const Dashboard = () => (
  <>
    <Helmet>
      <title> Dashboard: Home </title>
    </Helmet>

    <Home />
  </>
)

export default Dashboard;