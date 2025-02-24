import { Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { normalize } from "../main/home";
import { CheckBox } from "@ui-kitten/components";
import { useTheme } from "../../themeContext";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';


function CardPasto({ text, meals, selectedDay, type, username, updateMealStatus }) {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const styles = getStyles(theme);

    // Funzione per convertire la data da DD/MM/YYYY a YYYY-MM-DD
    const normalizeDate = (date) => {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    };

    // Funzione per normalizzare la data dei pasti in YYYY-MM-DD
    const formatMealDate = (dateString) => {
        return new Date(dateString).toISOString().split("T")[0];
    };

    // Filtra i pasti che corrispondono alla data selezionata
    const selectedMeals = meals.filter(meal => formatMealDate(meal.data) === normalizeDate(selectedDay));

    const handleToggle = async (item) => {
        try {
            const updatedMeal = {
                ...item,
                checkedPranzo: type === "pranzo" ? !item.checkedPranzo : item.checkedPranzo,
                checkedCena: type === "cena" ? !item.checkedCena : item.checkedCena
            };

            updateMealStatus(updatedMeal);
            const response = await axios.post(`http://192.168.1.89:8080/updateCheckMeal/${username}/${type}`, {
                item
            })
            if (response.data === "ok") {
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleMealPage = async (meal) => {
        try {
            const mealId = type === "pranzo" ? meal.pranzo : meal.cena;

            if (!mealId) {
                console.warn("Nessun pasto registrato");
                return;
            }

            const response = await axios.get(`http://192.168.1.89:8080/getMealInfo/${mealId}`);

            navigation.navigate("Home", {
                screen: "MealPage",
                params: { item: response.data }, // Passa i dati del pasto se necessario
            });
        } catch (e) {
            console.log(e);
        }
    };

    const handleSearchMealPage = async () => {
        try {
            navigation.navigate("Home", {
                screen: "SearchMeals",
                params: {selectedDay, type}
            });
        } catch (e) {
            console.log(e);
        }
    };

    //TODO: mettere pasti come array per supportare piu di un cibo
    return (
        <View style={styles.cardPasto}>
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, padding: 10, borderColor: theme.coloreScuro, borderWidth: 1, borderRadius: 15 }} onPress={handleSearchMealPage}>
                <Text style={styles.dayText}>{text}</Text>
                <Image source={require("../../images/plusblack.png")} style={styles.iconContainer} />
            </TouchableOpacity>

            {selectedMeals.length > 0 ? (
                selectedMeals.map((meal, index) => (
                    <View key={index} style={styles.mealContainer}>

                        <CheckBox
                            checked={type == "pranzo" ? meal.checkedPranzo : meal.checkedCena}
                            onChange={() => handleToggle(meal)}
                        />
                        <TouchableOpacity onPress={() => handleMealPage(meal)}>
                            <Text style={styles.mealText}>
                                {type === "pranzo" ? (meal.pranzo || "Nessun pasto registrato") : (meal.cena || "Nessun pasto registrato")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.noMealText}>Nessun pasto disponibile</Text>
            )}
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
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 3,
        paddingVertical: 15,
        marginVertical: 15,
        borderColor: "#E2E8F0",
        borderWidth: 1,
        flex: 1,
    },
    mealContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 15,
        alignItems: "center"
    }
});

export default CardPasto;
