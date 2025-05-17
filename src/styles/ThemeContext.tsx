import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = {
  primary: string;
  background: string;
  surface: string;
  text: string;
};

const lightTheme: Theme = {
  primary: '#e53935',    // red
  background: '#fff',
  surface: '#f5f5f5',
  text: '#000',
};

const darkTheme: Theme = {
  primary: '#e53935',    // same red for dark too
  background: '#121212',
  surface: '#222',
  text: '#fff',
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeContextProvider');
  return context;
};
