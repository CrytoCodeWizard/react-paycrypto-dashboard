import { Helmet } from 'react-helmet-async';

import OneView from 'src/sections/address/view';

// ----------------------------------------------------------------------

const Address = () => (
  <>
    <Helmet>
      <title> Pay Crypto | Addresses</title>
    </Helmet>

    <OneView />
  </>
)

export default Address;