import React, { useState, useEffect, useCallback } from "react";
import { Layout, Text, CheckBox, Input } from "@ui-kitten/components";
import { View, StyleSheet, TouchableOpacity, Animated, Easing, SafeAreaView, ScrollView, Image, ActivityIndicator, Dimensions, TextInput, RefreshControl } from "react-native";
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
    const [allIngredients, setAllIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [filteredIngredients, setFilteredIngredients] = useState();
    const [usingAsyncStorage, setUsingAsyncStorage] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);


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

    useEffect(() => {
        handleSave()
    }, [checklist])

    const handleAddIngredient = (ingredientId) => {
        setChecklist((prevChecklist) => {
            const existingIndex = prevChecklist.findIndex(item => item.id === ingredientId);

            if (existingIndex !== -1) {
                // Se l'ingrediente esiste, incrementa la quantità
                return prevChecklist.map(item =>
                    item.id === ingredientId ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Se non esiste, lo aggiunge con quantità 1
                return [...prevChecklist, { id: ingredientId, quantity: 1 }];
            }
        });
    };


    const handleRemoveIngredient = (ingredientId) => {
        setChecklist((prevChecklist) => {
            return prevChecklist
                .map(item =>
                    item.id === ingredientId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0); // Rimuove l'ingrediente se la quantità è 0
        });
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(`http://192.168.1.89:8080/updateChecklist/${username}`, {
                checklist
            })
            if (response.data != "ok") {
                console.log("problema")
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleAddChecklist = (ingredientId) => {
        // Aggiorna `filteredData` aumentando `quantity` dell'ingrediente selezionato
        setFilteredData((prevFilteredData) =>
            prevFilteredData.map(item =>
                item._id === ingredientId ? { ...item, quantity: (item.quantity || 0) + 1 } : item
            )
        );

        // Aggiorna `checklist`
        setChecklist((prevChecklist) => {
            const ingredient = filteredData.find(item => item._id === ingredientId);
            if (!ingredient) return prevChecklist; // Se non trovato, non fare nulla

            const existingIndex = prevChecklist.findIndex(item => item.id === ingredientId);

            if (existingIndex !== -1) {
                // Se l'ingrediente esiste già, incrementa la quantità
                return prevChecklist.map(item =>
                    item.id === ingredientId ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevChecklist, { ...ingredient, id: ingredient._id, quantity: 1, checked: false }];
            }
        });
    };


    const handleRemoveChecklist = (ingredientId) => {
        let maxRemovableQuantity = 0;

        // Prima otteniamo la quantità attuale dell'ingrediente in `filteredData`
        setFilteredData((prevFilteredData) => {
            return prevFilteredData.map(item => {
                if (item._id === ingredientId) {
                    maxRemovableQuantity = item.quantity || 0; // Salva la quantità originale
                    return { ...item, quantity: Math.max((item.quantity || 0) - 1, 0) };
                }
                return item;
            });
        });

        // Ora aggiorniamo `checklist`, riducendo la quantità al massimo di quella registrata in `maxRemovableQuantity`
        setChecklist((prevChecklist) =>
            prevChecklist
                .map(item =>
                    item.id === ingredientId
                        ? { ...item, quantity: Math.max(item.quantity - 1, item.quantity - maxRemovableQuantity) }
                        : item
                )
                .filter(item => item.quantity > 0) // Rimuove l'elemento se `quantity` diventa 0
        );
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

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await getChecklist(); // Chiamata per aggiornare la lista della spesa
        setIsRefreshing(false);
    };

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
                        <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16} refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                        }>
                            <View style={[styles.cardAddIngredient, { borderColor: theme.coloreScuro, borderWidth: 1 }]}>
                                {checklist.length === 0 ? (
                                    // Se la lista è vuota, mostra un messaggio
                                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                                        <Text style={{ fontSize: 18, color: 'black', fontFamily: 'Poppins_400Regular' }}>
                                            La tua lista della spesa è vuota!
                                        </Text>
                                        <Text style={{ fontSize: 14, color: 'gray', fontFamily: 'Poppins_300Light', marginTop: 10 }}>
                                            Aggiungi nuovi ingredienti o aggiorna la lista.
                                        </Text>
                                    </View>
                                ) : (
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
                                                            <TouchableOpacity style={styles.buttonMinus} onPress={() => handleRemoveIngredient(item.id)}>
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
                                                            <TouchableOpacity style={styles.buttonAdd} onPress={() => handleAddIngredient(item.id)}>
                                                                <Image source={require('../../images/plus.png')} style={styles.icon} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
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
                                                    <TouchableOpacity style={styles.buttonMinus} onPress={() => handleRemoveChecklist(item._id)}>
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
                                                            <Text style={{ color: "black" }}>{item.quantity}</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity style={styles.buttonAdd} onPress={() => handleAddChecklist(item._id)}>
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
    checkedText: {
        textDecorationLine: 'line-through',
        color: 'gray',
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
});

export default Checklist;