import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { greenTheme, purpleTheme, blueTheme, redTheme } from "./theme";
import { DevSettings } from "react-native"; // Per riavviare l'app

const ThemeContext = createContext();

// Mappa dei temi disponibili
const themes = {
  green: greenTheme,
  purple: purpleTheme,
  blue: blueTheme,
  red: redTheme,
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(greenTheme); // Default: greenTheme

  // Carica il tema da AsyncStorage all'avvio
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemeName = await AsyncStorage.getItem("appTheme"); // Recupera stringa
        if (savedThemeName && themes[savedThemeName]) {
          setTheme(themes[savedThemeName]); // Usa la mappa dei temi
        }
      } catch (error) {
        console.error("Errore nel caricamento del tema:", error);
      }
    };
    
    loadTheme();
  }, []);

  // Cambia il tema in base alla scelta dell'utente
  const toggleTheme = async (selectedTheme) => {
    if (!themes[selectedTheme]) {
      console.error("Tema non valido:", selectedTheme);
      return;
    }

    const newTheme = themes[selectedTheme];
    setTheme(newTheme);

    try {
      await AsyncStorage.setItem("appTheme", selectedTheme); // Salva solo il nome del tema
      DevSettings.reload(); // Riavvia l'app per applicare il tema
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
