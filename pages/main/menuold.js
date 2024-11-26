import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from '@ui-kitten/components';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import SwipeCarousel from './swipecarousel.js';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function Menu() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  const { width: screenWidth } = Dimensions.get('window');
  
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername !== null) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsername();
  }, []);

  const handleMeals = useCallback(async () => {
    if (username !== "") { // Controlla se i dati sono già stati caricati
      try {
        const response = await axios.get(`https://my-expense-five.vercel.app/getMeals/${username}`);
        if (response.data.success) {
          const processedData = processMealsData(response.data.data);
          setData(processedData);
        }
      } catch (error) {
        console.log("Errore nella chiamata API:", error);
      }
    }
  }, [username]); // Aggiungi dataLoaded alle dipendenze

  useFocusEffect(
    useCallback(() => {
      handleMeals();
    }, [handleMeals])
  );

  const processMealsData = (data) => {
    const daysOrder = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
    const daysFullNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

    return daysOrder.map((day, index) => {
      const meals = data[day];
      return {
        giorno: daysFullNames[index],
        pranzo: meals.pranzo ? {
          nome: meals.pranzo.nome,
          description: meals.pranzo.description,
          ingredients: meals.pranzo.ingredients.join(', '),
          difficolta: meals.pranzo.difficulty,
          tempo: meals.pranzo.timing,
          icon: meals.pranzo.icon,
          id: meals.pranzo._id,
          rating: meals.pranzo.rating
        } : {
          nome: ''
        },
        cena: meals.cena ? {
          nome: meals.cena.nome,
          description: meals.cena.description,
          ingredients: meals.cena.ingredients.join(', '),
          difficolta: meals.cena.difficulty,
          tempo: meals.cena.timing,
          icon: meals.cena.icon,
          id: meals.cena._id,
          rating: meals.cena.rating
        } : {
          nome: ''
        }
      };
    });
  };

  return (
    <Layout style={styles.container}>
      <View>
        <Text style={[styles.text, { color: "black", fontFamily: 'MyriadPro-Bold', fontSize: 36 }]}> Menu </Text>
      </View>
      <View style={styles.separator} />
      <SwipeCarousel data={data} username={username} updateData={handleMeals} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
  },
  text: {
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
});

export default Menu;
