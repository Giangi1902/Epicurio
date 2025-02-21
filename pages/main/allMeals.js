import { Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import DiagonalBackground from "./diagonalbackground";
import { useTheme } from "../../themeContext";
import { useNavigation } from '@react-navigation/native';

const { width: deviceWidth, height: screenHeight } = Dimensions.get("window");


function AllMeals() {
    const [username, setUsername] = useState("")
    const [meals, setMeals] = useState([])
    const route = useRoute()
    const { categoria } = route.params
    const { theme } = useTheme()
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(-1);
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
        handleMeals();
    }, [username]);

    const handleMeals = async () => {
        setIsLoading(true);

        if (username != "") {
            try {
                const index = 1 + currentIndex
                const response = await axios.get(`http://192.168.1.89:8080/categoryAllMeals/${categoria}/${index}`)
                setCurrentIndex(currentIndex + 1);
                setMeals(prevdata => [...prevdata, ...response.data]);
            }
            catch (e) {
                console.log(e)
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleMinus = async (id) => {
        // Verifica che la quantità da sottrarre sia maggiore o uguale a zero
        // const itemToUpdate = dispensa.find(item => item.id === id);
        // if (itemToUpdate?.quantity >= 1) {
        //     try {
        //         // Aggiorna immediatamente la quantità nel frontend
        //         const updatedDispensa = dispensa.map(item => {
        //             if (item.id === id) {
        //                 return { ...item, quantity: item.quantity - 1 };
        //             }
        //             return item;
        //         });
        //         setDispensa(updatedDispensa);

        //         // Invia la richiesta di aggiornamento al backend
        //         const response = await axios.put(`http://192.168.1.89:8080/updateIngredientQuantity/${id}`, { quantity: -1, username });
        //         if (!response.data) {
        //             console.log("Errore nell'aggiornamento della quantità nel backend");
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
    };

    const handlePlus = async (id) => {
        // try {
        //     // Aggiorna immediatamente la quantità nel frontend
        //     const updatedDispensa = dispensa.map(item => {
        //         if (item.id === id) {
        //             return { ...item, quantity: item.quantity + 1 };
        //         }
        //         return item;
        //     });
        //     setDispensa(updatedDispensa);

        //     // Invia la richiesta di aggiornamento al backend
        //     const response = await axios.put(`http://192.168.1.89:8080/updateIngredientQuantity/${id}`, { quantity: 1, username });
        //     if (!response.data) {
        //         console.log("Errore nell'aggiornamento della quantità nel backend");
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    };

    const loadMoreMeals = async () => {
        setIsLoading(true); // Imposta lo stato di caricamento
        await handleMeals(); // Chiamata alla funzione per ottenere nuovi ingredienti
        setIsLoading(false); // Reset dello stato di caricamento
    };

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

        // Calcola se siamo alla fine dello scroll
        const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isEndReached && !isLoading) {
            loadMoreMeals();
        }
    };

    const handleMealPage = async (item) => {
        try {
            navigation.navigate("Menu", {
                screen: "MealPage",
                params: { item },
            });
        }
        catch (e) {
            console.log(e)
        }
    }

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
            const response = await axios.get(`http://192.168.1.89:8080/searchCategoryMeals/${categoria}?query=${searchQuery}`);
            setFilteredData(response.data);
        } catch (error) {
            console.log("Errore nella ricerca:", error);
        }
    };

    //TODO: mettere loading
    return (
        <View style={styles.container}>
            <DiagonalBackground
                imageSize={30}
                spacing={15}
                opacity={0.2}
                categoria={categoria}
            />
            <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: theme.coloreScuro, fontSize: 36, fontFamily: "Poppins_600SemiBold_Italic" }}>{categoria.toUpperCase()}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between", marginHorizontal: "3%" }}>
                <TextInput style={{ width: "85%", height: 45, backgroundColor: "white", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", paddingLeft: 15, fontSize: 12, fontFamily: "Poppins_500Medium" }}
                    placeholder="Cerca un ingrediente..."
                    placeholderTextColor="#A0A0A0"
                    onChangeText={setQuery}
                    value={query}
                />
                <TouchableOpacity onPress={() => setQuery("")} style={{ height: 45, width: 45, backgroundColor: theme.coloreScuro, borderRadius: 15, alignItems: "center", justifyContent: "center" }}>
                    <Image source={require("../../images/times.png")} style={{ width: 20, height: 20 }}></Image>
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                <ScrollView showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
                    <View style={[styles.cardAddIngredient, { borderColor: theme.coloreScuro, borderWidth: 1 }]}>
                        {query === "" ? 
                        (meals.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => handleMealPage(item)}>
                                <View key={item.id} style={[styles.itemContainer]}>
                                    <View style={styles.itemTextContainer}>
                                        <Image source={{ uri: item.imageBase64 }} style={{ height: 100, width: 100, backgroundColor: theme.coloreScuro }}></Image>
                                        <Text style={[{ fontFamily: 'Poppins_300Light', color: "black", fontSize: 16, padding: 15, flex: 1, }]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )))
                        :
                        (filteredData.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => handleMealPage(item)}>
                                <View key={item.id} style={[styles.itemContainer]}>
                                    <View style={styles.itemTextContainer}>
                                        <Image source={{ uri: item.imageBase64 }} style={{ height: 100, width: 100, backgroundColor: theme.coloreScuro }}></Image>
                                        <Text style={[{ fontFamily: 'Poppins_300Light', color: "black", fontSize: 16, padding: 15, flex: 1, }]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )))
                    }
                    </View>
                </ScrollView>
            </View>
            <DiagonalBackground />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    card: {
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 2,
        elevation: 3,
        padding: 25,
        marginBottom: 10
    },
    cardIngredients: {
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 2,
        elevation: 3,
        padding: 25,
        marginBottom: 10
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkBox: {
        marginRight: 8,
        marginLeft: 5
    },
    itemTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemPrice: {
        fontSize: 18,
        color: 'white',
    },
    checkedText: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    mainButton: {
        position: 'relative',
        bottom: 20,
        zIndex: 1,
    },
    buttonContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#1B4965',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
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
        backgroundColor: '#1B4965',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 5,
        alignSelf: 'flex-end',
    },
    buttonMinus: {
        width: 40,
        height: 40,
        backgroundColor: '#9B0800',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 8,
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    quantityNotification: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#9B0800',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    quantityText: {
        color: 'white',
        fontSize: 12,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'black',
        borderWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 15,
    },
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    separator: {
        width: '90%',
        height: 1,
        backgroundColor: 'black',
        marginVertical: 20,
    },
    separateCategory: {
        height: 1,
        backgroundColor: 'gray',
        marginVertical: 10,
    },
    listContainer: {
        flex: 1,
        paddingTop: 10,
        width: deviceWidth * 0.95,
        marginTop: 15,
        alignSelf: "center"
    },
    totalContainer: {
        backgroundColor: '#407F40',
        padding: 10,
        width: 100,
        borderRadius: 15,
        marginBottom: 20
    },
    checkContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#407F40',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    bottomContainer: {
        bottom: 20,
        left: 20,
        padding: 10,
        borderRadius: 5,
    },
    totalText: {
        fontSize: 18,
        color: 'white',
        textAlign: "center"
    },
    saveButton: {
        backgroundColor: 'blue',
        padding: 10,
        margin: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
    },
    lastItemContainer: {
        marginBottom: 80,
    },
    loadingContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    text: {
        fontFamily: "MyriadPro-Regular"
    }
})

export default AllMeals