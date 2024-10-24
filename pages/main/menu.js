import { Button, Input, Layout, Text } from "@ui-kitten/components";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Modal, ScrollView, StatusBar, SafeAreaView, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 0.7;

function Home() {
    const [username, setUsername] = useState("");
    const navigation = useNavigation();
    const [currentDay, setCurrentDay] = useState("")
    const [data, setData] = useState([])
    const [mealListModalVisible, setMealListModalVisible] = useState(false);
    const [meals, setMeals] = useState([]);
    const [mealtype, setMealType] = useState("")

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

    const handleCategory = async (category) => {
        navigation.navigate("Category", { categoria: category });
    }

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
            handleNextMeal();
        }, [currentDay, username])
    );

    const handleNextMeal = async () => {
        if (currentDay && username) {
            try {
                const response = await axios.get(`https://my-expense-five.vercel.app/getNextMeal/${currentDay}/${username}`);
                setData(response.data);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const openMealListModal = async () => {
        try {
            const response = await axios.get(`https://my-expense-five.vercel.app/getAllMeals/${username}`);
            setMeals(response.data);
            setMealListModalVisible(true);
        } catch (e) {
            console.log(e);
        }
    };

    const closeMealListModal = () => {
        setMealListModalVisible(false);
    };

    const handleEdit = async (item) => {
        try {
            const response = await axios.post(`https://my-expense-five.vercel.app/changeMeal`, {
                id: item._id,
                username: username,
                orario: mealtype,
                day: currentDay
            })
            handleNextMeal()
            setMealListModalVisible(false)
        }
        catch (e) {
            console.log(e)
        }
    };


    //TODO: sistemare bottom tab bar
    return (
        <Layout style={styles.container}>
            <StatusBar translucent={true} backgroundColor={'#FFF7E8'} barStyle={"dark-content"} />
            <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 15 }}>
                <Text style={{ color: "black", fontSize: 40, fontFamily: "MyriadPro-Bold" }}>Dispensa</Text>
            </View>
            <View style={{ alignItems: "center", flex: 1, marginTop: 15 }}>
                <View style={styles.imageContainer}>
                    <ImageBackground source={require("../../emptyshelf.jpg")} style={styles.image}>
                        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
                            <TouchableOpacity onPress={() => handleCategory("riso")}>
                                <Image source={require('../../images/rice.png')} style={[styles.icon]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("pasta")}>
                                <Image source={require('../../images/spaghetti.png')} style={[styles.icon]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("panificio")}>
                                <Image source={require('../../images/bread.png')} style={[styles.icon]} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
                            <TouchableOpacity onPress={() => handleCategory("carne")}>
                                <Image source={require('../../images/meat.png')} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("pesce")}>
                                <Image source={require('../../images/fish.png')} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("latte e formaggi")}>
                                <Image source={require('../../images/cheese.png')} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
                            <TouchableOpacity onPress={() => handleCategory("frutta e verdura")}>
                                <Image source={require('../../images/healthy-food.png')} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("surgelati")}>
                                <Image source={require('../../images/frozen-food.png')} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("biscotti")}>
                                <Image source={require('../../images/cookie.png')} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
                            <TouchableOpacity onPress={() => handleCategory("bevande")}>
                                <Image source={require('../../images/plastic.png')} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("condimenti")}>
                                <Image source={require('../../images/olive-oil.png')} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCategory("altro")}>
                                <Image source={require('../../images/surprise-box.png')} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </Layout>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF7E8",
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
    iconContainer: {
        height: "25%",
    },
    icon: {
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        resizeMode: 'contain',
        marginTop: "100%",
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
    dayText: {
        fontSize: 16,
        fontFamily: "MyriadPro-Regular",
        marginVertical: 1
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
        backgroundColor: '#f7f7f7',
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
        marginVertical: 10
    }
});


export default Home;
