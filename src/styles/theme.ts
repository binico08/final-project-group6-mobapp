export type ThemeType = {
  background: string;
  primary: string;
  text: string;
  inputBackground: string;
  error: string;
  buttonBackground: string;
  surface: string;
  surfaceLight: string;
  modalBackground: string;
};

export const lightTheme: ThemeType = {
  background: '#fff',
  primary: '#B22222',
  text: '#000',
  inputBackground: '#eee',
  error: '#ff4444',
  buttonBackground: '#B22222',
  surface: '#f5f5f5',
  surfaceLight: '#fafafa',
  modalBackground: '#fff',
};

export const darkTheme: ThemeType = {
  background: '#000',
  primary: '#B22222',
  text: '#fff',
  inputBackground: '#222',
  error: '#ff4444',
  buttonBackground: '#B22222',
  surface: '#222',
  surfaceLight: '#333',
  modalBackground: '#111',
};
