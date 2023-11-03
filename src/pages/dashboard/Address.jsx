import { Helmet } from 'react-helmet-async';

import OneView from 'src/sections/address/view';

// ----------------------------------------------------------------------

const Address = () => (
  <>
    <Helmet>
      <title> Pay Crypto | Address</title>
    </Helmet>

    <OneView />
  </>
)

export default Address;