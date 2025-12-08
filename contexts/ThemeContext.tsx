import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'cyberpunk' | 'retro' | 'matrix' | 'dracula' | 'white' | 'classic';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('terminal_theme') as Theme) || 'cyberpunk';
  });

  const availableThemes: Theme[] = ['cyberpunk', 'retro', 'matrix', 'dracula', 'white', 'classic'];

  useEffect(() => {
    localStorage.setItem('terminal_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
