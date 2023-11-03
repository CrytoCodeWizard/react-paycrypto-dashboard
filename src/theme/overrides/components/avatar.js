import { alpha } from '@mui/material/styles';
import { avatarGroupClasses } from '@mui/material/AvatarGroup';

// ----------------------------------------------------------------------

const COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'];

const colorByName = (name) => {
  const charAt = name.charAt(0).toLowerCase();

  if (['a', 'c', 'f'].includes(charAt)) return 'primary';
  if (['e', 'd', 'h'].includes(charAt)) return 'secondary';
  if (['i', 'k', 'l'].includes(charAt)) return 'info';
  if (['m', 'n', 'p'].includes(charAt)) return 'success';
  if (['q', 's', 't'].includes(charAt)) return 'warning';
  if (['v', 'x', 'y'].includes(charAt)) return 'error';
  return 'default';
};

// ----------------------------------------------------------------------

export function avatar(theme) {
  return {
    MuiAvatar: {
      variants: COLORS.map((color) =>
        color === 'default'
          ? {
              props: { color: 'default' },
              style: {
                color: theme.palette.text.secondary,
                backgroundColor: alpha(theme.palette.grey[500], 0.24),
              },
            }
          : {
              props: { color },
              style: {
                color: theme.palette[color].contrastText,
                backgroundColor: theme.palette[color].main,
              },
            }
      ),

      styleOverrides: {
        rounded: {
          borderRadius: theme.shape.borderRadius * 1.5,
        },
        colorDefault: ({ ownerState }) => {
          const color = colorByName(`${ownerState.alt}`);

          return {
            ...(!!ownerState.alt && {
              ...(color !== 'default'
                ? {
                    color: theme.palette[color].contrastText,
                    backgroundColor: theme.palette[color].main,
                  }
                : {
                    color: theme.palette.text.secondary,
                    backgroundColor: alpha(theme.palette.grey[500], 0.24),
                  }),
            }),
          };
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          justifyContent: 'flex-end',
          ...(ownerState.variant === 'compact' && {
            width: 40,
            height: 40,
            position: 'relative',
            [`& .${avatarGroupClasses.avatar}`]: {
              margin: 0,
              width: 28,
              height: 28,
              position: 'absolute',
              '&:first-of-type': {
                left: 0,
                bottom: 0,
                zIndex: 9,
              },
              '&:last-of-type': {
                top: 0,
                right: 0,
              },
            },
          }),
        }),
        avatar: {
          fontSize: 16,
          fontWeight: theme.typography.fontWeightSemiBold,
          '&:first-of-type': {
            fontSize: 12,
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.lighter,
          },
        },
      },
    },
  };
}
