import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { greenTheme, purpleTheme } from "./theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(greenTheme); // Default a greenTheme

  // Carica il tema da AsyncStorage all'avvio
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");
        if (savedTheme) {
          setTheme(JSON.parse(savedTheme)); // Converti stringa in oggetto
        }
      } catch (error) {
        console.error("Errore nel caricamento del tema:", error);
      }
    };

    loadTheme();
  }, []);

  // Cambia tema e salva in AsyncStorage
  const toggleTheme = async () => {
    const newTheme = theme === greenTheme ? purpleTheme : greenTheme;
    setTheme(newTheme);
    
    try {
      await AsyncStorage.setItem("appTheme", JSON.stringify(newTheme));
    } catch (error) {
      console.error("Errore nel salvataggio del tema:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
