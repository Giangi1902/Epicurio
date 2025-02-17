import { Layout, Text } from "@ui-kitten/components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, StatusBar, PixelRatio, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import CardPasto from "../components/cardPasto";
import Calendario from "./calendar";
import Diet from "./diet";
import { useTheme } from "../../themeContext";

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 0.7;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
    const newSize = size * scale
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

function Home() {
    const [username, setUsername] = useState("");
    const navigation = useNavigation();
    const [currentDay, setCurrentDay] = useState("")
    const [data, setData] = useState([])
    const [meals, setMeals] = useState([])
    const {theme, toggleTheme} = useTheme();

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem("username");
                if (storedUsername !== null) {
                    setUsername(storedUsername);
                }
            } catch (error) {
                console.log("error");
            }
        };
        fetchUsername();
    }, []);

    const getCurrentDay = () => {
        const now = new Date();
        const dayIndex = now.getDay();

        const weekDays = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
        const mappedDayIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
        setCurrentDay(weekDays[mappedDayIndex])
    };

    useFocusEffect(
        React.useCallback(() => {
            getCurrentDay()
            // handleNextMeal();
            handleGetMeals();
        }, [currentDay, username])
    );

    const handleNextMeal = async () => {
        if (currentDay && username) {
            try {
                const response = await axios.get(`http://172.20.10.7:8080/getNextMeal/${currentDay}/${username}`);
                setData(response.data);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const [glasses, setGlasses] = useState([{ id: 1, type: "whitewater" }]);

    const handlePress = (id) => {
        setGlasses((prevGlasses) => {
            // Trova l'indice del bicchiere cliccato
            const clickedIndex = prevGlasses.findIndex((glass) => glass.id === id);

            // Se il bicchiere è whitewater, cambia il tipo in water e aggiungi un nuovo whitewater
            if (prevGlasses[clickedIndex].type === "whitewater") {
                // Cambia il tipo di whitewater in water e aggiungi un nuovo bicchiere whitewater
                return [
                    ...prevGlasses.slice(0, clickedIndex),
                    { ...prevGlasses[clickedIndex], type: "water" }, // Cambia il bicchiere cliccato in "water"
                    ...prevGlasses.slice(clickedIndex + 1), // Mantieni i bicchieri successivi
                    { id: prevGlasses.length + 1, type: "whitewater" }, // Aggiungi un nuovo bicchiere whitewater
                ];
            }

            // Se il bicchiere è water, cambialo in whitewater e elimina tutti i bicchieri successivi
            if (prevGlasses[clickedIndex].type === "water") {
                return prevGlasses
                    .slice(0, clickedIndex + 1) // Mantieni solo i bicchieri fino a quello cliccato
                    .map((glass, index) =>
                        index === clickedIndex
                            ? { ...glass, type: "whitewater" } // Cambia il tipo del bicchiere cliccato
                            : glass
                    );
            }

            return prevGlasses;
        });
    };

    const handleAddMeals = async () => {
        try {
            const response = await axios.get(`http://172.20.10.7:8080/createSchedule/${username}`);
        }
        catch (e) {
            console.log(e);
        }
    };

    const handleGetMeals = async () => {
        try{
            const response = await axios.get(`http://172.20.10.7:8080/getMeals/${username}`);
            setMeals(response.data);
            console.log(response.data);
        }
        catch(e){
            console.log(e);
        }
    }


    //TODO: migliorare il calendario
    return (
        <Layout style={styles.container}>
            <StatusBar translucent={true} backgroundColor={theme.coloreChiaro} barStyle={"dark-content"} />
            <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View>
                    <Button title="Cambia tema" onPress={toggleTheme} />
                </View>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Image source={require("../../images/image.png")} style={{ height: 75, width: 75 }} />
                    <Text style={{ color: theme.coloreScuro, fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic", marginHorizontal: -5 }}> picurio</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={{ backgroundColor: "white", width: "95%", alignSelf: "center", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0"}} >
                    <Calendario meals={meals} />

                    <TouchableOpacity onPress={handleAddMeals}>
                        <Image source={require("../../images/magic-wand.png")} style={[styles.icon, { alignSelf: "center", margin: 10 }]}></Image>
                    </TouchableOpacity>
                </View>
                {/* <Diet/> */}
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    dayText: {
        color: "#0B7308",
        fontFamily: "Poppins_500Medium",
        alignSelf: "center",
        fontSize: normalize(14)
    },
    iconContainer: {
        height: 15,
        width: 15,
        alignSelf: "center"
    },
    iconBottle: {
        height: 50,
        width: 50,
        marginBottom: 20
    },
    imageContainer: {
        width: "80%",
        aspectRatio: 512 / 600,
        overflow: "hidden",
        borderRadius: 15,
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    icon: {
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        resizeMode: 'contain',

    },
    daysListContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginHorizontal: (screenWidth - CARD_WIDTH) / 2,
        backgroundColor: '#fff',
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
    },
    daysList: {
        justifyContent: "space-around",
    },
    dayButton: {
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginVertical: 5,
    },
    separator: {
        height: 1,
        width: '90%',
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    mealListModalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealListModalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        height: CARD_HEIGHT * 1.5
    },
    modalTitle: {
        fontSize: 22,
        color: "black",
        fontFamily: "MyriadPro-Bold"
    },
    mealList: {
        marginTop: 20,
    },
    mealItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    mealItemText: {
        fontSize: 18,
        fontFamily: "MyriadPro-SemiBold",
        color: "black"
    },
    mealItemSubText: {
        fontSize: 16,
        color: "black",
        fontFamily: "MyriadPro-Light"
    },
    closeButton: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginHorizontal: 15,
    },
    addButton: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    addButtonText: {
        fontSize: 20,
        fontFamily: "MyriadPro-Regular",
        color: "black",
    },
    commonButtonStyle: {
        height: CARD_HEIGHT / 2,
        justifyContent: 'center',
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
        borderColor: "#097373",
        borderWidth: 1
    },
    scrollView: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginVertical: 15,
    },
});


export default Home;
