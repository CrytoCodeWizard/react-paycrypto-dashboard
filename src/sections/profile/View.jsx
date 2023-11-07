import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ComponentBlock from 'src/components/component-block';
import { useSettingsContext } from 'src/components/settings';

import Table from 'src/sections/profile/Table';

const CashOutPanel = () => {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography variant="h4"> Account Overview </Typography>

            <Stack sx={{ mt: 5 }}>
                <ComponentBlock>
                    <Table />
                </ComponentBlock>
            </Stack>
        </Container>
    );
}

export default CashOutPanel;