import { Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ScrollView } from "react-native";
import { normalize } from "../main/home";
import { Layout } from "@ui-kitten/components";
import { useTheme } from "../../themeContext";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import DiagonalBackground from "./diagonalbackground";


function CreateMenu() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const styles = getStyles(theme);
    const route = useRoute()
    const { username } = route.params
    const [selectedDates, setSelectedDates] = useState([]); // Stato per memorizzare le date selezionate
    const [selectedMeals, setSelectedMeals] = useState([]); // Stato per memorizzare le date selezionate
    const [showCalendar, setShowCalendar] = useState(false); // Stato per mostrare il calendario
    const [currentIndex, setCurrentIndex] = useState(null); // Indice della card che sta aprendo il calendario

    // Funzione per aprire il calendario per una card specifica
    const handleShowCalendar = (index) => {
        setCurrentIndex(index);
        setShowCalendar(true);
    };

    // Funzione per gestire la selezione della data
    const handleDateChange = (event, date) => {
        if (date) {
            if (currentIndex !== null) {
                const updatedDates = [...selectedDates];
                updatedDates[currentIndex] = date;
                setSelectedDates(updatedDates);
            } else {
                setSelectedDates([...selectedDates, date]);
            }
        }
        setShowCalendar(false);
        setCurrentIndex(null);
    };

    const handleAddMeals = async () => {
        try {
            // Filtra solo le date che hanno almeno un pasto selezionato
            const mealsToSend = selectedDates
                .map((date, index) => {
                    const mealSelection = selectedMeals[index] || { pranzo: false, cena: false };

                    if (mealSelection.pranzo || mealSelection.cena) {
                        return {
                            data: date.toISOString().split("T")[0], // Formatta la data in YYYY-MM-DD
                            pranzo: mealSelection.pranzo,
                            cena: mealSelection.cena
                        };
                    }
                    return null;
                })
                .filter(item => item !== null); // Rimuove elementi null (cioè senza pasti selezionati)

            // Conta il numero totale di pasti selezionati (quante volte 'pranzo' o 'cena' sono true)
            const totalMealsSelected = mealsToSend.reduce((count, meal) => {
                return count + (meal.pranzo ? 1 : 0) + (meal.cena ? 1 : 0);
            }, 0);

            // Se non ci sono pasti selezionati, non inviare nulla
            if (mealsToSend.length === 0) {
                alert("Seleziona almeno un pasto prima di confermare!");
                return;
            }

            // Invia i dati al server
            const response = await axios.post(`http://192.168.1.89:8080/createSchedule/${username}`, {
                totalMeals: totalMealsSelected,
                meals: mealsToSend
            });

            if (response.data === "ok") {
                navigation.goBack();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleSelectMeal = (index, mealType) => {
        setSelectedMeals((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                [mealType]: !prev[index]?.[mealType], // Inverte la selezione
            },
        }));
    };

    //TODO: aggiungere loading
    return (
        <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
            <DiagonalBackground
                imageSize={30} // Dimensione di ogni piccola immagine
                spacing={15}
                opacity={0.2}
                categoria="crea"
            />
            <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: theme.coloreScuro, fontFamily: 'Poppins_600SemiBold_Italic', fontSize: 36 }}>Crea menu</Text>
                </View>
            </View>
            <ScrollView>
                {selectedDates.map((date, index) => (
                    <View key={index} style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                        <Text style={styles.dayText}>{date.toLocaleDateString("it-IT")}</Text>

                        {/* Pulsanti PRANZO e CENA */}
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                            <TouchableOpacity
                                style={[
                                    styles.mealButton,
                                    {
                                        backgroundColor: selectedMeals[index]?.pranzo ? theme.coloreScuro : "white", padding: 10,
                                        borderRadius: 15, borderColor: selectedMeals[index]?.pranzo ? "white" : theme.coloreScuro, borderWidth: 1
                                    },
                                ]}
                                onPress={() => handleSelectMeal(index, "pranzo")}
                            >
                                <Text style={{ color: selectedMeals[index]?.pranzo ? "white" : theme.coloreScuro }}>PRANZO</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.mealButton,
                                    {
                                        backgroundColor: selectedMeals[index]?.cena ? theme.coloreScuro : "white", padding: 10,
                                        borderRadius: 15, borderColor: selectedMeals[index]?.cena ? "white" : theme.coloreScuro, borderWidth: 1
                                    },
                                ]}
                                onPress={() => handleSelectMeal(index, "cena")}
                            >
                                <Text style={{ color: selectedMeals[index]?.cena ? "white" : theme.coloreScuro }}>CENA</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* CARD "AGGIUNGI GIORNO" */}
                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }} onPress={() => handleShowCalendar(null)}>
                        <Text style={styles.dayText}>Aggiungi giorno</Text>
                        <Image source={require("../../images/plusblack.png")} style={styles.iconContainer} />
                    </TouchableOpacity>
                </View>
                <View style={{padding: 10}}>
                    {showCalendar && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            style={{ backgroundColor: theme.coloreScuro, flex: 1, alignSelf: "center", paddingRight: 5, borderRadius: 15 }}
                        />
                    )}
                </View>
                <View>
                    <TouchableOpacity onPress={() => handleAddMeals()} style={[styles.cardAddIngredient, { backgroundColor: theme.coloreScuro }]}>
                        <Text style={[styles.dayText, { color: "white" }]}>Conferma</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    dayText: {
        color: "black",
        fontFamily: "Poppins_500Medium",
        alignSelf: "center",
        fontSize: 20
    },
    mealText: {
        color: "black",
        fontFamily: "Poppins_400Regular",
        alignSelf: "center",
        fontSize: 16
    },
    noMealText: {
        color: "gray",
        fontFamily: "Poppins_400Regular",
        alignSelf: "center",
        fontSize: 14,
        marginVertical: 10
    },
    iconContainer: {
        height: 20,
        width: 20,
        alignSelf: "center"
    },
    cardPasto: {
        width: "95%",
        alignSelf: "center",
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 3,
        paddingVertical: 15,
        marginVertical: 15,
        borderWidth: 1,
    },
    cardAddIngredient: {
        borderRadius: 15,
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
    mealContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 15,
        alignItems: "center"
    }
});

export default CreateMenu;
