import { useContext, createContext } from 'react';

// ----------------------------------------------------------------------

export const SettingsContext = createContext({});

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};
