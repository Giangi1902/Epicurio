import { Layout, Text } from "@ui-kitten/components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, StatusBar, PixelRatio, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';


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
                const response = await axios.get(`http://192.168.1.123:8080/getNextMeal/${currentDay}/${username}`);
                setData(response.data);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const openMealListModal = async () => {
        try {
            const response = await axios.get(`http://192.168.1.123:8080/getAllMeals/${username}`);
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
            const response = await axios.post(`http://192.168.1.123:8080/changeMeal`, {
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


    return (
        <Layout style={styles.container}>
            <StatusBar translucent={true} backgroundColor={'#ADC8AD'} barStyle={"dark-content"} />
            <View style={{ backgroundColor: "#ADC8AD", borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: "#0B7308", fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic", marginHorizontal: -5 }}>Dispensa</Text>
                </View>
            </View>
            <View style={{ alignItems: "center", marginTop: 15 }}>
                <TextInput style={{ width: "95%", height: 45, backgroundColor: "white", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", paddingLeft: 15, fontSize: normalize(12), fontFamily: "Poppins_500Medium" }}
                    placeholder="Cerca nella dispensa..."
                    placeholderTextColor="#A0A0A0"
                />
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={{ backgroundColor: "white", width: "95%", alignSelf: "center", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 15 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Text style={{color: "black", alignSelf: "center", fontFamily: "Poppins_600SemiBold", fontSize: normalize(20), marginTop: 15}}>Categorie</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", marginHorizontal: 10 }}>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/rice.png')} style={[styles.icon]} />
                                    <Text style={styles.categoryText}>RISO</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/spaghetti.png')} style={[styles.icon]} />
                                    <Text style={styles.categoryText}>PASTA</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/bread.png')} style={[styles.icon]} />
                                    <Text style={styles.categoryText}>PANE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/meat.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>CARNE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/fish.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>PESCE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/cheese.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>LATTE E FORMAGGI</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/healthy-food.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>FRUTTA E VERDURA</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/frozen-food.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>SURGELATI</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/cookie.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>BISCOTTI</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/plastic.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>BEVANDE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/olive-oil.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>CONDIMENTI</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardPasto}>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require('../../images/surprise-box.png')} style={styles.icon} />
                                    <Text style={styles.categoryText}>ALTRO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </Layout>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
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
        height: 15,
        width: 15,
        alignSelf: "center"
    },
    scrollView: {
        paddingTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 15
    },
    icon: {
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        resizeMode: 'contain',
    },
    daysList: {
        justifyContent: "space-around",
    },
    categoryText: {
        color: "black",
        fontFamily: "Poppins_500Medium",
        alignSelf: "center",
        fontSize: normalize(12),
        marginTop: 15
    },
    cardPasto: {
        width: "40%",
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
        borderColor: "#0B7308",
        borderWidth: 1
    },
});


export default Home;
