import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ComponentBlock from 'src/components/component-block';
import { useSettingsContext } from 'src/components/settings';

import UserTable from "src/sections/user/Table";

const UserPanel = () => {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography variant="h4"> User </Typography>

            <Stack spacing={3} sx={{ mt: 5 }}>
                <ComponentBlock>
                    <Card sx={{ width: 1 }}>
                        <UserTable />
                    </Card>
                </ComponentBlock>
            </Stack>
        </Container>
    )
}

export default UserPanel;