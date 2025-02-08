import { startOfYear, endOfYear, eachWeekOfInterval, addDays, eachDayOfInterval, format } from "date-fns";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import PagerView from "react-native-pager-view";
import { it } from 'date-fns/locale'; // Importa la locale italiana
import CardPasto from "../components/cardPasto";

const Calendario = () => {

  const today = new Date();

  // Includi tutte le settimane dell'anno corrente
  const startOfYearDate = startOfYear(today); // Inizio dell'anno
  const endOfYearDate = endOfYear(today); // Fine dell'anno

  // Genera le settimane per tutto l'anno
  const dates = eachWeekOfInterval(
    {
      start: startOfYearDate,
      end: endOfYearDate
    },
    {
      weekStartsOn: 1 // Settimana che inizia di lunedì
    }).reduce((acc, curr) => {
      const allDays = eachDayOfInterval({
        start: curr,
        end: addDays(curr, 6) // Genera i giorni della settimana
      });
      acc.push(allDays);
      return acc;
    }, []);

  // Trova l'indice della settimana corrente
  const currentWeekIndex = dates.findIndex(week => {
    return week.some(day => day.toDateString() === today.toDateString());
  });

  // Funzione per verificare se una data è oggi
  const isToday = (day) => {
    return day.toDateString() === today.toDateString();
  };

  const [selectedDay, setSelectedDay] = useState(today);

  return (
    <View style={{ flex: 1 }}>
      <PagerView 
        style={{ height: 400 }} 
        initialPage={currentWeekIndex}
        onPageSelected={(e) => {
          // Imposta il primo giorno della settimana visualizzata come selectedDay
          const selectedWeekIndex = e.nativeEvent.position;
          setSelectedDay(dates[selectedWeekIndex][0]);
        }}
      >
        {dates.map((week, i) => (
          <View key={i} style={{ flex: 1, }}>
            <View style={styles.row}>
              {week.map((day, k) => {
                const txt = format(day, "EEEEE", { locale: it });
                const dayMonth = format(day, "d MMM", { locale: it });
                const dayIsToday = isToday(day);
                const isSelected =
                  selectedDay && selectedDay.toDateString() === day.toDateString();

                return (
                  <TouchableOpacity key={k} onPress={() => setSelectedDay(day)}>
                    <View style={[ 
                      styles.day, 
                      dayIsToday && !isSelected && styles.todayTextGreen, 
                      dayIsToday && isSelected && styles.todayDaySelected, 
                      isSelected && styles.selectedDay 
                    ]}>
                      <Text style={[ 
                        dayIsToday && !isSelected && styles.todayTextGreen, 
                        dayIsToday && isSelected && styles.selectedTextWhite, 
                        isSelected && styles.selectedTextWhite,
                        styles.textMonth,
                      ]}> {txt} </Text>
                      <Text style={[ 
                        dayIsToday && !isSelected && styles.todayTextGreen, 
                        dayIsToday && isSelected && styles.selectedTextWhite,
                        isSelected && styles.selectedTextWhite, 
                        styles.textDay,
                      ]}> {dayMonth} </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedDay && (
              <ScrollView style={{ flexGrow: 1 }} 
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
                <CardPasto text={`COLAZIONE per ${format(selectedDay, "d MMM", { locale: it,})}`}/>
                <CardPasto text={`PRANZO per ${format(selectedDay, "d MMM", {locale: it,})}`}/>
                <CardPasto text={`CENA per ${format(selectedDay, "d MMM", {locale: it,})}`}/>
              </ScrollView>
            )}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  day: {
    alignItems: 'center',
    padding: 5,
    marginTop: 5
  },
  todayDay: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 5
  },
  todayTextGreen: {
    color: '#0B7308',
    fontWeight: 'Poppins_400Regular',
  },
  todayDaySelected: {
    backgroundColor: '#0B7308',
    borderRadius: 10,
    padding: 5
  },
  selectedDay: {
    backgroundColor: '#0B7308',
    borderRadius: '40%',
    padding: 5,
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
  }
});

export default Calendario;
