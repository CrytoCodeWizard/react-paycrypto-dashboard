import { Helmet } from 'react-helmet-async';

import AddressTable from 'src/sections/address/view';

// ----------------------------------------------------------------------

const Address = () => (
  <>
    <Helmet>
      <title> Pay Crypto | Address</title>
    </Helmet>

    <AddressTable />
  </>
)

export default Address;