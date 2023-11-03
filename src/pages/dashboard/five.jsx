import { Helmet } from 'react-helmet-async';

import FiveView from 'src/sections/five/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Five</title>
      </Helmet>

      <FiveView />
    </>
  );
}
