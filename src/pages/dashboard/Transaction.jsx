import { Helmet } from 'react-helmet-async';

import FourView from 'src/sections/transaction/view';

const Transaction = () => (
  <>
    <Helmet>
      <title> Dashboard: Transactions</title>
    </Helmet>

    <FourView />
  </>
)

export default Transaction;