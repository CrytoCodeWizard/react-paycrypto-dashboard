import { Helmet } from 'react-helmet-async';

import FiveView from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

const Dashboard = () => (
  <>
    <Helmet>
      <title> Dashboard: Home </title>
    </Helmet>

    <FiveView />
  </>
)

export default Dashboard;