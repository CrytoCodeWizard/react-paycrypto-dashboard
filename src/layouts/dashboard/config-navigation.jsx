import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();

  const data = useMemo(
    () => {
      const navData = [{
        subheader: '',
        items: [
          {
            title: 'home',
            path: paths.dashboard.root,
            icon: ICONS.dashboard
          },
          {
            title: 'address',
            path: paths.dashboard.address,
            icon: ICONS.file
          },
          {
            title: 'transaction',
            path: paths.dashboard.transaction,
            icon: ICONS.invoice
          },
          {
            title: 'withdraw',
            path: paths.dashboard.withdraw,
            icon: ICONS.banking,
          },
          {
            title: 'cashout',
            path: paths.dashboard.cashout,
            icon: ICONS.job,
          }
        ]
      }];

      if (user?.role === "ADMINISTRATOR") {
        navData[0].items.push({
          title: 'user',
          path: paths.dashboard.user,
          icon: ICONS.user,
        });
      }
      return navData;
    }, [user?.role]);

  return data;
}
