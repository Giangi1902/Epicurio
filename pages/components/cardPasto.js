import { Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { normalize } from "../main/home";
import { CheckBox } from "@ui-kitten/components";
import { useTheme } from "../../themeContext";

function CardPasto({ text, meals, selectedDay, type }) {
    const [isChecked, setIsChecked] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const styles = getStyles(theme);

    //controllare il selectedDay con il campo data del pasto in meals
    const selectedMeal = meals.find(meal => {
        const mealDate = new Date(meal.data).toISOString().split("T")[0]; // Converte data in formato YYYY-MM-DD
        const selectedDate = new Date(selectedDay).toISOString().split("T")[0]; // Converte selectedDay in stesso formato
        return mealDate === selectedDate;
    });

    //TODO: checkbox solo per la giornata corrente del pasto corrente
    //TODO: quando fa il check del pasto, rimuovere gli ingredienti utilizzati da quel pasto dalla dispensa
    return (
        <View style={styles.cardPasto}>
            <TouchableOpacity style={{ padding: 5 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10 }}>
                    <Text style={styles.dayText}>{text}</Text>
                    <Image source={require("../../images/plusblack.png")} style={styles.iconContainer} />
                </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, marginVertical: 20 }}>
                <CheckBox
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                />
                <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                    <Text style={styles.mealText}>
                        {selectedMeal && type == "pranzo" ? selectedMeal.pranzo : null}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    dayText: {
        color: "black",
        fontFamily: "Poppins_500Medium",
        alignSelf: "center",
        fontSize: normalize(14)
    },
    mealText: {
        color: "black",
        fontFamily: "Poppins_400Regular",
        alignSelf: "center",
        fontSize: normalize(14)
    },
    iconContainer: {
        height: 15,
        width: 15,
        alignSelf: "center"
    },
    cardPasto: {
        width: "80%",
        alignSelf: "center",
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 2,
        elevation: 3,
        paddingVertical: 15,
        marginVertical: 10,
        borderColor: theme.coloreScuro,
        borderWidth: 1,
        flex: 1,
    },
});

export default CardPasto

