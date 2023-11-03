import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import { presetOptions } from 'src/theme/options/presets';

// ----------------------------------------------------------------------

export default function PresetsOptions({ value, onChange }) {
  return (
    <Box columnGap={2} rowGap={1.5} display="grid" gridTemplateColumns="repeat(3, 1fr)">
      {presetOptions.map((option) => {
        const selected = value === option.name;

        return (
          <ButtonBase
            key={option.name}
            onClick={() => onChange(option.name)}
            sx={{
              height: 56,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
              ...(selected && {
                borderColor: 'transparent',
                bgcolor: alpha(option.value, 0.08),
              }),
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: option.value,
                transition: (theme) =>
                  theme.transitions.create(['transform'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(selected && {
                  transform: 'scale(2)',
                }),
              }}
            />
          </ButtonBase>
        );
      })}
    </Box>
  );
}
PresetsOptions.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
