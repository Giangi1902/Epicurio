import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import InputSpinner from "react-native-input-spinner";
import axios from "axios"

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const CARD_WIDTH = screenWidth * 0.8;

const daysOfWeek = [
    { day: "LUNEDÌ", pranzo: false, cena: false },
    { day: "MARTEDÌ", pranzo: false, cena: false },
    { day: "MERCOLEDÌ", pranzo: false, cena: false },
    { day: "GIOVEDÌ", pranzo: false, cena: false },
    { day: "VENERDÌ", pranzo: false, cena: false },
    { day: "SABATO", pranzo: false, cena: false },
    { day: "DOMENICA", pranzo: false, cena: false },
];

function MenuForm({ username, updateData }) {
    const [budget, setBudget] = useState(0);
    const [menu, setMenu] = useState(daysOfWeek);

    const handleCheckBoxChange = (index, mealType) => {
        const newMenu = [...menu];
        newMenu[index][mealType] = !newMenu[index][mealType];
        setMenu(newMenu);
    };

    const handleAddMeals = async () => {
        try {
            const selectedMeals = menu
                .filter(day => day.pranzo || day.cena)
                .map(day => ({
                    day: day.day.toLowerCase(),
                    pranzo: day.pranzo,
                    cena: day.cena,
                }));

            const response = await axios.post(`http://192.168.1.89:8080/newMenu`, {
                selectedMeals: selectedMeals,
                budget: budget,
                username: username
            })
            // if (response.data == "nonsufficiente") {
            //     console.log("budget non sufficiente per creare tutta la settimana")
            // }
            await updateData()
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer]}>
                <Text category="h6" style={styles.label}>Inserisci budget</Text>
                <InputSpinner
                    min={0}
                    step={1}
                    colorMin={"#9B0800"}
                    value={budget}
                    skin='clean'
                    onChange={(e) => setBudget(e)}
                    width={"50%"}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.daysContainer}>
                    <Text category="h6" style={styles.label}>Scegli quali pasti </Text>
                    {menu.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.dayText}>{item.day}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        item.pranzo ? styles.buttonFilled : styles.buttonOutline,
                                    ]}
                                    onPress={() => handleCheckBoxChange(index, "pranzo")}
                                >
                                    <Text style={{ color: item.pranzo ? "white" : "#696969", fontFamily: "MyriadPro-Regular", fontSize: 14 }}>Pranzo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        item.cena ? styles.buttonFilled : styles.buttonOutline,
                                    ]}
                                    onPress={() => handleCheckBoxChange(index, "cena")}
                                >
                                    <Text style={{ color: item.cena ? "white" : "#696969", fontFamily: "MyriadPro-Regular", fontSize: 14 }}>Cena</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={[styles.card, { borderColor: "black", borderWidth: 0.5 }]} onPress={handleAddMeals}>
                        <Text style={{ fontSize: 20, fontFamily: "MyriadPro-Bold" }}>Conferma</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        color: "black",
        alignSelf: "center",
        fontFamily: "MyriadPro-SemiBold",
        fontSize: 22
    },
    input: {
        marginBottom: 16,
        backgroundColor: "white",
        width: "80%",
        alignSelf: "center"
    },
    daysContainer: {
        marginBottom: 16,
    },
    dayText: {
        marginBottom: 8,
        fontSize: 18,
        color: "black",
        fontFamily: "MyriadPro-Regular"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonFilled: {
        backgroundColor: "#407F40",
        borderColor: "#407F40",
        borderWidth: 1,
    },
    buttonOutline: {
        backgroundColor: "white",
        borderColor: "#407F40",
        borderWidth: 1,
    },
    card: {
        width: CARD_WIDTH,
        marginHorizontal: (screenWidth - CARD_WIDTH) / 2,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'center',
        paddingVertical: 20,
        marginVertical: 5,
        padding: 16,
    }
});

export default MenuForm;
