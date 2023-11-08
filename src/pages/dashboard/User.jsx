import { Helmet } from 'react-helmet-async';

import UserPanel from 'src/sections/user/view';

const User = () => (
    <>
        <Helmet>
            <title> Pay Crypto | User </title>
        </Helmet>

        <UserPanel />
    </>
)

export default User;