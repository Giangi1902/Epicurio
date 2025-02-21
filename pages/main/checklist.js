import React, { useState, useEffect, useCallback } from "react";
import { Layout, Text, CheckBox, Input } from "@ui-kitten/components";
import { View, StyleSheet, TouchableOpacity, Animated, Easing, SafeAreaView, ScrollView, Image, ActivityIndicator, Dimensions, TextInput } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { normalize } from "../main/home";
import BottomTogglePage from "../components/bottomToggle";
import { useTheme } from "../../themeContext";
import { LinearGradient } from 'expo-linear-gradient';
import DiagonalBackground from "./diagonalbackground";



const { width: deviceWidth, height: screenHeight } = Dimensions.get("window");


function Checklist() {
    const [username, setUsername] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [prices, setPrices] = useState([]);
    const [rotation] = useState(new Animated.Value(0));
    const [isPageVisible, setIsPageVisible] = useState(false);
    const [allIngredients, setAllIngredients] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [filteredIngredients, setFilteredIngredients] = useState();
    const [usingAsyncStorage, setUsingAsyncStorage] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);


    const [checklist, setChecklist] = useState([])
    const { theme } = useTheme();

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

    useFocusEffect(
        useCallback(() => {
            handleIngredients();
        }, [username])
    );

    useEffect(() => {
        setFilteredIngredients(allIngredients)
    }, [allIngredients])

    const handleToggle = useCallback(async (ingredientId) => {
        setIsLoading(true);
        const index = checklist.findIndex(item => item.id === ingredientId);
        if (index !== -1) {
            const newChecklist = [...checklist];
            newChecklist[index] = { ...newChecklist[index], checked: !newChecklist[index].checked };
            setChecklist(newChecklist);
            // await AsyncStorage.setItem("ingredients", JSON.stringify(newIngredients));
            try {
                const response = await axios.post(`http://192.168.1.89:8080/updateCheckbox/${username}/${ingredientId}`);
                if (response.data === "no") {
                    console.log("Problema aggiornamento della checkbox");
                }
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.error(`L'ingrediente con ID ${ingredientId} non è stato trovato nell'array ingredients`);
        }
    }, [checklist, username]);


    const handleIngredients = async () => {
        // if (username !== "") {
        //     setIsLoading(true);
        //     try {
        //         const response = await axios.get(`http://192.168.1.89:8080/getIngredients/${username}`);
        //         if (response.data !== "no") {
        //             setIngredients(response.data);
        //             await AsyncStorage.setItem("ingredients", JSON.stringify(response.data));
        //             setUsingAsyncStorage(false)
        //         } else {
        //             console.log("Nessun ingrediente trovato");
        //         }
        //     } catch (error) {
        //         console.log(error);
        //         const storedIngredients = await AsyncStorage.getItem("ingredients");
        //         if (storedIngredients !== null) {
        //             setIngredients(JSON.parse(storedIngredients));
        //             setUsingAsyncStorage(true)
        //         }
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }
    };

    const handlePrices = async (ingredients) => {
        // setIsLoading(true);
        // if (ingredients.length > 0) {
        //     try {
        //         const response = await axios.get(`http://192.168.1.89:8080/getCosts/${username}`);
        //         setPrices(response.data);
        //         await AsyncStorage.setItem("prices", JSON.stringify(response.data));
        //         setUsingAsyncStorage(false)
        //     } catch (error) {
        //         console.log(error);
        //         const storedPrices = await AsyncStorage.getItem("prices");
        //         if (storedPrices !== null) {
        //             setPrices(JSON.parse(storedPrices));
        //             setUsingAsyncStorage(true)
        //         }
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }
    };

    const handleMainButtonAnimation = () => {
        // const toValue = isPageVisible ? 0 : 1;
        // Animated.timing(rotation, { toValue, duration: 500, easing: Easing.linear, useNativeDriver: true }).start();
        // setIsPageVisible(!isPageVisible);
    };

    const handleAddIngredient = async (ingredientId) => {
        // const existingIndex = quantities.findIndex(item => item.id === ingredientId);
        // if (existingIndex !== -1) {
        //     const updatedQuantities = [...quantities];
        //     updatedQuantities[existingIndex].quantity++;
        //     setQuantities(updatedQuantities);
        // } else {
        //     setQuantities([...quantities, { id: ingredientId, quantity: 1 }]);
        // }
        // setSelectedIngredients([...selectedIngredients, ingredientId]);
    }

    const handleRemoveIngredient = async (ingredientId) => {
        // const existingIndex = quantities.findIndex(item => item.id === ingredientId);
        // if (existingIndex !== -1 && quantities[existingIndex].quantity > 0) {
        //     const updatedQuantities = [...quantities];
        //     updatedQuantities[existingIndex].quantity--;
        //     setQuantities(updatedQuantities);
        // }
    }

    const handleSave = async () => {
        // setIsLoading(true)
        // try {
        //     const newQuantities = quantities.map(item => ({ id: item.id, quantity: 0 }));
        //     const response = await axios.post(`http://192.168.1.89:8080/addIngredients`, {
        //         username, quantities
        //     })
        //     if (response.data == "ok") {
        //         handleIngredients();
        //         calculateTotalPrice();
        //         setIsPageVisible(false)
        //         setQuantities(newQuantities);
        //         setSearchText("")
        //     }
        // }
        // catch (e) {
        //     console.log(e)
        // }
        // finally {
        //     setIsLoading(false)
        // }
    }

    const handleAddChecklist = async (ingredientId) => {
        // setIsLoading(true);
        // const existingIndex = ingredients.findIndex(item => item.id === ingredientId);
        // if (existingIndex !== -1) {
        //     const updatedQuantities = [...ingredients];
        //     updatedQuantities[existingIndex].quantity++;
        //     setIngredients(updatedQuantities);
        //     calculateTotalPrice();
        //     await AsyncStorage.setItem("ingredients", JSON.stringify(updatedQuantities));
        //     try {
        //         const response = await axios.post(`http://192.168.1.89:8080/updateIngredientFromChecklist/${username}`, { updatedQuantities });
        //         if (response.data == "no") {
        //             console.log("Problema nell'aggiunta dell'ingrediente in db");
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }
    };

    const handleRemoveChecklist = async (ingredientId) => {
        // setIsLoading(true);
        // const existingIndex = ingredients.findIndex(item => item.id === ingredientId);

        // let updatedQuantities;

        // if (existingIndex !== -1 && ingredients[existingIndex].quantity > 0) {
        //     updatedQuantities = [...ingredients];
        //     updatedQuantities[existingIndex].quantity--;
        //     setIngredients(updatedQuantities);
        //     calculateTotalPrice();
        //     await AsyncStorage.setItem("ingredients", JSON.stringify(updatedQuantities));
        // }
        // try {
        //     const response = await axios.post(`http://192.168.1.89:8080/updateIngredientFromChecklist/${username}`, { updatedQuantities });
        //     if (response.data === "no") {
        //         console.log("problema nella rimozione dell'elemento");
        //     }
        // } catch (e) {
        //     console.log(e);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const handleDispensa = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`http://192.168.1.89:8080/addIngredientDispensa/${username}`, {
                checklist
            });
            if (response.data != "no") {
                setChecklist(response.data);
                // await AsyncStorage.setItem("ingredients", JSON.stringify(response.data));
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleSearch = (text) => {
    // setSearchText(text);
    // const filtered = allIngredients.filter(ingredient =>
    //     ingredient.nome.toLowerCase().includes(text.toLowerCase())
    // );
    // setFilteredIngredients(filtered);
    // };

    useEffect(() => {
        getChecklist()
    }, [username])

    const getChecklist = async () => {
        try {
            const response = await axios.get(`http://192.168.1.89:8080/getChecklist/${username}`)
            setChecklist(response.data)
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
            const response = await axios.get(`http://192.168.1.89:8080/searchIngredient?query=${searchQuery}`);
            setFilteredData(response.data);
        } catch (error) {
            console.log("Errore nella ricerca:", error);
        }
    };

    //TODO: aggiungere controllo se non c'è nulla in lista della spesa
    //TODO: quando poi ritorna eliminando la query di ricerca, aggiorna le quantità in lista della spesa
    //TODO: funzione per aggiungere gli item.checked === true in dispensa
    return (
        <Layout style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                    <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                        <Text style={{ color: theme.coloreScuro, fontFamily: 'Poppins_600SemiBold_Italic', fontSize: 36 }}>Lista della spesa</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between", width: "95%", alignSelf: "center" }}>
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
                {query === "" ? (
                    <View style={styles.listContainer}>
                        <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
                            <View style={[styles.cardAddIngredient, { borderColor: theme.coloreScuro, borderWidth: 1 }]}>
                                <View>
                                    {checklist.map((item, index) => (
                                        <View key={index}>
                                            {index === 0 || item.categoria !== checklist[index - 1]?.categoria ? (

                                                <View style={{ alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 16, textAlign: "center", color: "gray", fontFamily: 'Poppins_300Light' }}>{item.categoria}</Text>
                                                    <View style={[styles.separateCategory, { width: '75%' }]} />
                                                </View>
                                            ) : null}

                                            <View style={styles.itemContainer}>
                                                <CheckBox style={styles.checkBox} checked={item.checked} onChange={() => handleToggle(item.id)} />
                                                <View style={styles.itemTextContainer}>
                                                    <Text style={[styles.itemText, { fontFamily: 'Poppins_500Medium', color: item.checked === true ? "gray" : "black" }, item.checked === true ? styles.checkedText : null]}>
                                                        {item.nome}
                                                    </Text>
                                                </View>

                                                <View>
                                                    <View style={styles.buttonContainerAddMinus}>
                                                        <TouchableOpacity style={styles.buttonMinus} onPress={() => handleMinus(item.id)}>
                                                            <Image source={require('../../images/minus.png')} style={styles.icon} />
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
                                                            <View style={{ borderRadius: 20, overflow: "hidden", backgroundColor: "white" }}>
                                                                <Text style={{ color: "black" }}>{item.quantity}</Text>
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity style={styles.buttonAdd} onPress={() => handlePlus(item.id)}>
                                                            <Image source={require('../../images/plus.png')} style={styles.icon} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                        <TouchableOpacity style={styles.fab} onPress={handleDispensa}>
                            <Image source={require('../../images/check.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                ) : (
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
                                                        <Image source={require('../../images/minus.png')} style={styles.icon} />
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
                                                            <Text style={{ color: "black" }}>0</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity style={styles.buttonAdd} onPress={() => handlePlus(item.id)}>
                                                        <Image source={require('../../images/plus.png')} style={styles.icon} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

            </SafeAreaView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 15,
        alignSelf: "center",
        backgroundColor: '#0B7308',
        width: 50,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // Ombra su Android
        shadowColor: '#000', // Ombra su iOS
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
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
    icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    iconBottom: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    itemTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    itemText: {
        fontFamily: 'Poppins_500Medium',
        color: "black",
        fontSize: 16,
        padding: 15
    },
    itemPrice: {
        fontSize: 14
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
    buttonText: {
        color: 'white',
        fontSize: 18,
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
        marginBottom: 40,
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
        fontFamily: "MyriadPro-Regular"
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
        width: '95%',
        height: 1,
        backgroundColor: 'black',
        marginVertical: 10,
    },
    separateCategory: {
        height: 1,
        backgroundColor: 'gray',
        marginVertical: 10,
    },
    listContainer: {
        flex: 1,
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
});

export default Checklist;