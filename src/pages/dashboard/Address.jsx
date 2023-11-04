import { Helmet } from 'react-helmet-async';

import AddressPanel from 'src/sections/address/view';

// ----------------------------------------------------------------------

const Address = () => (
  <>
    <Helmet>
      <title> Pay Crypto | Address</title>
    </Helmet>

    <AddressPanel />
  </>
)

export default Address;