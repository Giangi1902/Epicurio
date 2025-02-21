import { Layout, Text } from "@ui-kitten/components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, StatusBar, PixelRatio, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../../themeContext";
import { LinearGradient } from 'expo-linear-gradient'

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
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false)

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

    const handleCategory = (categoria) => {
        navigation.navigate("Menu", {
            screen: "Category",
            params: { categoria },
        });
    };

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
                const response = await axios.get(`http://192.168.1.89:8080/getNextMeal/${currentDay}/${username}`);
                setData(response.data);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const openMealListModal = async () => {
        try {
            const response = await axios.get(`http://192.168.1.89:8080/getAllMeals/${username}`);
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
            const response = await axios.post(`http://192.168.1.89:8080/changeMeal`, {
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

    const [query, setQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const words = query.trim().split(/\s+/);
        const hasValidWord = words.some(word => word.length >= 3);

        if (hasValidWord) {
            handleSearch(query);
        } else {
            setFilteredData([]);
        }
    }, [query]);

    const handleSearch = async (searchQuery) => {
        try {
            const response = await axios.get(`http://192.168.1.89:8080/searchIngredient?query=${searchQuery}`);
            setFilteredData(response.data);
        } catch (error) {
            console.log("Errore nella ricerca:", error);
        }
    };

    return (
        <Layout style={styles.container}>
            <StatusBar translucent={true} backgroundColor={'#ADC8AD'} barStyle={"dark-content"} />
            <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: theme.coloreScuro, fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic" }}>Dispensa</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between", marginHorizontal: 10 }}>
                <TextInput style={{ width: "85%", height: 45, backgroundColor: "white", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", paddingLeft: 15, fontSize: normalize(12), fontFamily: "Poppins_500Medium" }}
                    placeholder="Cerca un ingrediente..."
                    placeholderTextColor="#A0A0A0"
                    onChangeText={setQuery}
                    value={query}
                />
                <TouchableOpacity onPress={() => setQuery("")} style={{ height: 45, width: 45, backgroundColor: theme.coloreScuro, borderRadius: 15, alignItems: "center", justifyContent: "center" }}>
                    <Image source={require("../../images/times.png")} style={{ width: 20, height: 20 }}></Image>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
                {query == "" ?
                    <View style={{ backgroundColor: "white", width: "95%", alignSelf: "center", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 15 }}>
                        <ScrollView style={{ flex: 1 }}>
                            <Text style={{ color: "black", alignSelf: "center", fontFamily: "Poppins_600SemiBold", fontSize: normalize(20), marginTop: 15 }}>Categorie</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", marginHorizontal: 10 }}>

                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro, width: "70%" }]}>
                                    <TouchableOpacity style={{}} onPress={() => handleCategory("pasta e riso")}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 10 }}>
                                            <Image source={require('../../images/spaghetti.png')} style={[styles.icon]} />
                                            <Image source={require('../../images/rice.png')} style={[styles.icon]} />
                                        </View>
                                        <Text style={styles.categoryText}>PASTA E RISO</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("preparazione")}>
                                        <Image source={require('../../images/flour.png')} style={[styles.icon]} />
                                        <Text style={styles.categoryText}>PREPARAZIONE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]} >
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("carni")}>
                                        <Image source={require('../../images/meat.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>CARNI</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("pesce")}>
                                        <Image source={require('../../images/fish.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>PESCE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("latte e uova")}>
                                        <Image source={require('../../images/cheese.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>LATTE E UOVA</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("frutta e verdura")}>
                                        <Image source={require('../../images/healthy-food.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>FRUTTA E VERDURA</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("spezie")}>
                                        <Image source={require('../../images/olive-oil.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>CONDIMENTI</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("dolci")}>
                                        <Image source={require('../../images/cookie.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>DOLCI</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("bevande")}>
                                        <Image source={require('../../images/plastic.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>BEVANDE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]} >
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("legumi")}>
                                        <Image source={require('../../images/legumes.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>LEGUMI</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cardPasto, { borderColor: theme.coloreScuro }]}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => handleCategory("altro")}>
                                        <Image source={require('../../images/surprise-box.png')} style={styles.icon} />
                                        <Text style={styles.categoryText}>ALTRO</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    :
                    <View style={styles.listContainer}>
                        <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16} >
                            <View style={[styles.cardAddIngredient, { borderColor: theme.coloreScuro, borderWidth: 1 }]}>
                                {filteredData.map((item, index) => (
                                    <View key={index}>
                                        <View key={item.id} style={[styles.itemContainer]}>
                                            <View style={styles.itemTextContainer}>
                                                <Text style={[{ fontFamily: 'Poppins_300Light', color: "black", fontSize: 16, padding: 15 }]}>
                                                    {item.nome}
                                                </Text>
                                            </View>
                                            <View>
                                                <View style={styles.buttonContainerAddMinus}>
                                                    <TouchableOpacity style={styles.buttonMinus} onPress={() => handleMinus(item.id)}>
                                                        <Image source={require('../../images/minus.png')} style={styles.iconButton} />
                                                    </TouchableOpacity>
                                                    <View style={{ width: 30, height: 40, justifyContent: "center", alignItems: "center" }}>
                                                        <LinearGradient
                                                            colors={["#9B0800", "#9B0800", "#0B7308", "#0B7308"]}
                                                            start={{ x: 0, y: 0.5 }}
                                                            end={{ x: 1, y: 0.5 }}
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: 2, // Spessore del bordo
                                                            }}
                                                        />
                                                        <LinearGradient
                                                            colors={["#9B0800", "#9B0800", "#0B7308", "#0B7308"]}
                                                            start={{ x: 0, y: 0.5 }}
                                                            end={{ x: 1, y: 0.5 }}
                                                            style={{
                                                                position: "absolute",
                                                                bottom: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: 2, // Spessore del bordo
                                                            }}
                                                        />
                                                        <View style={{ borderRadius: 20, overflow: "hidden" }}>
                                                            <Text style={{ color: "black" }}>1</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity style={styles.buttonAdd} onPress={() => handlePlus(item.id)}>
                                                        <Image source={require('../../images/plus.png')} style={styles.iconButton} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                }
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
    listContainer: {
        paddingTop: 10,
        width: screenWidth * 0.95,
        marginTop: 15,
        alignSelf: "center"
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    buttonContainerAddMinus: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    buttonAdd: {
        width: 40,
        height: 40,
        backgroundColor: '#0B7308',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: 5,
        alignSelf: 'flex-end',
    },
    buttonMinus: {
        width: 40,
        height: 40,
        backgroundColor: '#9B0800',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginLeft: 8,
        alignSelf: 'flex-end',
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
        marginBottom: 40
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
    iconButton: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
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
        borderWidth: 1
    },
});


export default Home;
