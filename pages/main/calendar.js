import { startOfYear, endOfYear, eachWeekOfInterval, addDays, eachDayOfInterval, format, addHours } from "date-fns";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image, RefreshControl, ScrollView } from 'react-native';
import { it } from 'date-fns/locale';
import CardPasto from "../components/cardPasto";
import { useTheme } from "../../themeContext";
import axios from "axios";

const { width: deviceWidth } = Dimensions.get("window");

const Calendario = ({ username }) => {
  const today = new Date();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const flatListRef = useRef(null);
  const [meals, setMeals] = useState([])
  const [refreshing, setRefreshing] = useState(false); // Stato per il pull-to-refresh

  const startOfYearDate = startOfYear(today);
  const endOfYearDate = endOfYear(today);

  // Funzione per ricaricare i pasti quando l'utente scrolla verso il basso
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await getMeals(); // Ricarica i pasti

      console.log("Pasti aggiornati!");
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
    }

    setRefreshing(false);
  }, []);


  const getMeals = async () => {
    try {
      const response = await axios.get(`http://192.168.1.89:8080/getMeals/${username}`)
      setMeals(response.data)
    }
    catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getMeals()
  }, [username])

  // Creazione delle settimane dell'anno
  const dates = eachWeekOfInterval(
    { start: startOfYearDate, end: endOfYearDate },
    { weekStartsOn: 1 }
  ).map((weekStart) => eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) }));

  // Trova l'indice della settimana corrente
  const currentWeekIndex = dates.findIndex(week =>
    week.some(day => day.toDateString() === today.toDateString())
  );

  // Imposta come giorno selezionato il giorno corrente
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentPage, setCurrentPage] = useState(currentWeekIndex);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: currentWeekIndex, animated: false });
      }, 100);
    }
  }, []);

  const handleScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / deviceWidth);
    setCurrentPage(newIndex);
    setSelectedDay(addHours(dates[newIndex].find(day => day.toDateString() === today.toDateString()) || dates[newIndex][0], 1));
  };

  const handleAddMeals = async () => {
    try {
      // const response = await axios.get(`http://192.168.1.89:8080/createSchedule/${username}`);
    }
    catch (e) {
      console.log(e);
    }
  };

  const updateMealStatus = (updatedMeal) => {
    setMeals(prevMeals =>
      prevMeals.map(meal =>
        meal.data === updatedMeal.data ? updatedMeal : meal
      )
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={dates}
        keyExtractor={(item, index) => index.toString()}
        snapToInterval={deviceWidth}
        snapToAlignment="start"
        getItemLayout={(data, index) => ({ length: deviceWidth, offset: deviceWidth * index, index })}
        initialScrollIndex={currentWeekIndex}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current.scrollToIndex({ index: info.index, animated: true });
          }, 100);
        }}
        renderItem={({ item: week }) => (
          <View style={{ width: deviceWidth, flex: 1 }}>
            <View style={[styles.row, { borderTopColor: theme.coloreScuro, borderBottomColor: theme.coloreScuro, borderTopWidth: 1, borderBottomWidth: 1 }]}>
              {week.map((day, k) => {
                const txt = format(day, "EEEEE", { locale: it });
                const dayMonth = format(day, "d MMM", { locale: it });
                const isToday = day.toDateString() === today.toDateString();
                const isSelected = selectedDay.toDateString() === day.toDateString();
                return (
                  <TouchableOpacity key={k} onPress={() => setSelectedDay(day)}>
                    <View style={[
                      styles.day,
                      isToday && !isSelected && styles.todayTextGreen,
                      isToday && isSelected && styles.todayDaySelected,
                      isSelected && styles.selectedDay
                    ]}>
                      <Text style={[
                        isToday && !isSelected && styles.todayTextGreen,
                        isToday && isSelected && styles.selectedTextWhite,
                        isSelected && styles.selectedTextWhite,
                        styles.textMonth,
                      ]}> {txt} </Text>
                      <Text style={[
                        isToday && !isSelected && styles.todayTextGreen,
                        isToday && isSelected && styles.selectedTextWhite,
                        isSelected && styles.selectedTextWhite,
                        styles.textDay,
                      ]}> {dayMonth} </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <ScrollView
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.coloreScuro]} />
              }
            >
              <View style={{ backgroundColor: "white", marginTop: 15, width: "100%", alignSelf: "center", padding: 10, borderColor: theme.coloreScuro, borderTopWidth: 1, borderBottomWidth: 1 }}>
                {selectedDay && (
                  <View>
                    <CardPasto text={`PRANZO`} meals={meals} selectedDay={selectedDay.toLocaleDateString()} type={"pranzo"} username={username} updateMealStatus={updateMealStatus} />
                    <CardPasto text={`CENA`} meals={meals} selectedDay={selectedDay.toLocaleDateString()} type={"cena"} username={username} updateMealStatus={updateMealStatus} />
                  </View>
                )}
                <TouchableOpacity onPress={handleAddMeals} style={[styles.cardAddIngredient, { backgroundColor: theme.coloreScuro }]}>
                  <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 18, textAlign: "center", color: "white" }}>Crea il menu</Text>
                  {/* <Image source={require("../../images/magic-wand.png")} style={[styles.icon, { alignSelf: "center", margin: 10 }]}></Image> */}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      />
    </View>
  );
};


const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  day: {
    alignItems: 'center',
    marginVertical: 10,
    padding: 5
  },
  todayTextGreen: {
    color: theme.coloreScuro,
    fontWeight: 'Poppins_400Regular',
  },
  todayDaySelected: {
    backgroundColor: theme.coloreScuro,
    borderRadius: 10,
    padding: 5
  },
  selectedDay: {
    backgroundColor: theme.coloreScuro,
    borderRadius: '40%',
    padding: 5
  },
  selectedTextWhite: {
    color: 'white',
    fontWeight: 'Poppins_400Regular',
  },
  textDay: {
    fontSize: 10,
    fontFamily: "Poppins_400Regular"
  },
  textMonth: {
    fontFamily: "Poppins_400Regular"
  },
  icon: {
    width: deviceWidth * 0.1,
    height: deviceWidth * 0.1,
    resizeMode: 'contain',
  },
  cardAddIngredient: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
    },
    shadowRadius: 2,
    elevation: 3,
    padding: 15,
    marginTop: 5,
    marginBottom: 15,
    alignSelf: "center",
  },
});

export default Calendario;
