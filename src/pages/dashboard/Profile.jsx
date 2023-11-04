import { Helmet } from 'react-helmet-async';

import ProfilePanel from 'src/sections/profile/View';

const Address = () => (
    <>
        <Helmet>
            <title> Pay Crypto | Profile </title>
        </Helmet>

        <ProfilePanel />
    </>
)

export default Address;