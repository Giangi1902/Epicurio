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

    const handleToggle = async (meal, item) => {
        try {
            const updatedMeal = {
                ...meal,
                [type]: meal[type].map(p =>
                    p.mealId === item.mealId ? { ...p, checked: !p.checked } : p
                )
            };

            updateMealStatus(updatedMeal);
            await axios.post(`http://192.168.1.89:8080/updateCheckMeal/${username}/${type}`, {
                item, selectedDay
            });
            const updatedItem = updatedMeal[type].find(p => p.mealId === item.mealId);
            if (updatedItem?.checked) {
                handleRemoveIngredients(item);
            }

        }
        catch (e) {
            console.log(e);
        }
    };


    const handleRemoveIngredients = async (item) => {
        try {
            const response = await axios.post(`http://192.168.1.89:8080/removeIngredients/${username}`, {
                item
            })
            if (response.data == "ok") {
                console.log("dispensa aggiornata")
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleMealPage = async (meal) => {
        try {
            const mealId = meal.mealId

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
                params: { selectedDay, type }
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.cardPasto}>
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, padding: 10, borderColor: theme.coloreScuro, borderWidth: 1, borderRadius: 15 }} onPress={handleSearchMealPage}>
                <Text style={styles.dayText}>{text}</Text>
                <Image source={require("../../images/plusblack.png")} style={styles.iconContainer} />
            </TouchableOpacity>

            {selectedMeals.length > 0 ? (
                selectedMeals.map((meal, index) => (
                    <View key={index}>
                        {type === "pranzo" && meal.pranzo.length > 0 ? (
                            meal.pranzo.map((p, idx) => (
                                <View key={idx} style={styles.mealContainer}>
                                    <CheckBox
                                        checked={p.checked}
                                        onChange={() => handleToggle(meal, p)}
                                    />
                                    <TouchableOpacity onPress={() => handleMealPage(p)}>
                                        <Text style={styles.mealText}>{p.title || "Nessun pasto registrato"}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : type === "cena" && meal.cena.length > 0 ? (
                            meal.cena.map((c, idx) => (
                                <View key={idx} style={styles.mealContainer}>
                                    <CheckBox
                                        checked={c.checked}
                                        onChange={() => handleToggle(meal, c)}
                                    />
                                    <TouchableOpacity onPress={() => handleMealPage(c)}>
                                        <Text style={styles.mealText}>{c.title || "Nessun pasto registrato"}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noMealText}>Nessun pasto disponibile</Text>
                        )}
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
        borderRadius: 15,
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
