import { Helmet } from 'react-helmet-async';

import Cashout from 'src/sections/cashout/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: CashOut</title>
      </Helmet>

      <Cashout />
    </>
  );
}
