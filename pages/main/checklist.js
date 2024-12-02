import React, { useState, useEffect, useCallback } from "react";
import { Layout, Text, CheckBox, Input } from "@ui-kitten/components";
import { View, StyleSheet, TouchableOpacity, Animated, Easing, SafeAreaView, ScrollView, Image, ActivityIndicator, PixelRatio, Dimensions } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { normalize } from "../main/home";

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
            handleAllIngredients();
        }, [username])
    );

    useEffect(() => {
        calculateTotalPrice();
    }, [prices, ingredients]);

    useEffect(() => {
        setFilteredIngredients(allIngredients)
    }, [allIngredients])

    const handleToggle = useCallback(async (ingredientId) => {
        setIsLoading(true);
        const index = ingredients.findIndex(item => item.id === ingredientId);
        if (index !== -1) {
            const newIngredients = [...ingredients];
            newIngredients[index] = { ...newIngredients[index], checked: !newIngredients[index].checked };
            setIngredients(newIngredients);
            calculateTotalPrice();
            await AsyncStorage.setItem("ingredients", JSON.stringify(newIngredients));
            try {
                const response = await axios.post(`https://my-expense-five.vercel.app/updateCheckbox/${username}/${ingredientId}`);
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
    }, [ingredients, username]);


    const handleIngredients = async () => {
        if (username !== "") {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://my-expense-five.vercel.app/getIngredients/${username}`);
                if (response.data !== "no") {
                    setIngredients(response.data);
                    handlePrices(response.data);
                    await AsyncStorage.setItem("ingredients", JSON.stringify(response.data));
                    setUsingAsyncStorage(false)
                } else {
                    console.log("Nessun ingrediente trovato");
                }
            } catch (error) {
                console.log(error);
                const storedIngredients = await AsyncStorage.getItem("ingredients");
                if (storedIngredients !== null) {
                    setIngredients(JSON.parse(storedIngredients));
                    setUsingAsyncStorage(true)
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleAllIngredients = async () => {
        setIsLoading(true);
        if (username !== "") {
            try {
                const response = await axios.get(`https://my-expense-five.vercel.app/getAllIngredients/${username}`);
                setAllIngredients(response.data);
                await AsyncStorage.setItem("allIngredients", JSON.stringify(response.data));
                setUsingAsyncStorage(false)
            } catch (error) {
                console.log(error);
                const storedAllIngredients = await AsyncStorage.getItem("allIngredients");
                if (storedAllIngredients !== null) {
                    setAllIngredients(JSON.parse(storedAllIngredients));
                    setUsingAsyncStorage(true)
                }
            } finally {
                setIsLoading(false);
            }
        }
    };


    const handlePrices = async (ingredients) => {
        setIsLoading(true);
        if (ingredients.length > 0) {
            try {
                const response = await axios.get(`https://my-expense-five.vercel.app/getCosts/${username}`);
                setPrices(response.data);
                await AsyncStorage.setItem("prices", JSON.stringify(response.data));
                setUsingAsyncStorage(false)
            } catch (error) {
                console.log(error);
                const storedPrices = await AsyncStorage.getItem("prices");
                if (storedPrices !== null) {
                    setPrices(JSON.parse(storedPrices));
                    setUsingAsyncStorage(true)
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleMainButtonAnimation = () => {
        const toValue = isPageVisible ? 0 : 1;
        Animated.timing(rotation, { toValue, duration: 500, easing: Easing.linear, useNativeDriver: true }).start();
        setIsPageVisible(!isPageVisible);
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        prices.forEach((price, index) => {
            const ingredient = ingredients.find(item => item.id === prices[index].id);
            if (ingredient && !ingredient.checked) {
                totalPrice += price.cost * ingredient.quantity;
            }
        });
        totalPrice = totalPrice.toFixed(2);
        setTotalPrice(totalPrice);
    };

    const handleAddIngredient = async (ingredientId) => {
        const existingIndex = quantities.findIndex(item => item.id === ingredientId);
        if (existingIndex !== -1) {
            const updatedQuantities = [...quantities];
            updatedQuantities[existingIndex].quantity++;
            setQuantities(updatedQuantities);
        } else {
            setQuantities([...quantities, { id: ingredientId, quantity: 1 }]);
        }
        setSelectedIngredients([...selectedIngredients, ingredientId]);
    }

    const handleRemoveIngredient = async (ingredientId) => {
        const existingIndex = quantities.findIndex(item => item.id === ingredientId);
        if (existingIndex !== -1 && quantities[existingIndex].quantity > 0) {
            const updatedQuantities = [...quantities];
            updatedQuantities[existingIndex].quantity--;
            setQuantities(updatedQuantities);
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const newQuantities = quantities.map(item => ({ id: item.id, quantity: 0 }));
            const response = await axios.post(`https://my-expense-five.vercel.app/addIngredients`, {
                username, quantities
            })
            if (response.data == "ok") {
                handleIngredients();
                calculateTotalPrice();
                setIsPageVisible(false)
                setQuantities(newQuantities);
                setSearchText("")
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleAddChecklist = async (ingredientId) => {
        setIsLoading(true);
        const existingIndex = ingredients.findIndex(item => item.id === ingredientId);
        if (existingIndex !== -1) {
            const updatedQuantities = [...ingredients];
            updatedQuantities[existingIndex].quantity++;
            setIngredients(updatedQuantities);
            calculateTotalPrice();
            await AsyncStorage.setItem("ingredients", JSON.stringify(updatedQuantities));
            try {
                const response = await axios.post(`https://my-expense-five.vercel.app/updateIngredientFromChecklist/${username}`, { updatedQuantities });
                if (response.data == "no") {
                    console.log("Problema nell'aggiunta dell'ingrediente in db");
                }
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleRemoveChecklist = async (ingredientId) => {
        setIsLoading(true);
        const existingIndex = ingredients.findIndex(item => item.id === ingredientId);

        let updatedQuantities;

        if (existingIndex !== -1 && ingredients[existingIndex].quantity > 0) {
            updatedQuantities = [...ingredients];
            updatedQuantities[existingIndex].quantity--;
            setIngredients(updatedQuantities);
            calculateTotalPrice();
            await AsyncStorage.setItem("ingredients", JSON.stringify(updatedQuantities));
        }
        try {
            const response = await axios.post(`https://my-expense-five.vercel.app/updateIngredientFromChecklist/${username}`, { updatedQuantities });
            if (response.data === "no") {
                console.log("problema nella rimozione dell'elemento");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDispensa = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`https://my-expense-five.vercel.app/addIngredientDispensa/${username}`, {
                ingredients
            });
            if (response.data != "no") {
                setIngredients(response.data);
                await AsyncStorage.setItem("ingredients", JSON.stringify(response.data));
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = allIngredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredIngredients(filtered);
    };



    //TODO: aggiornare vercel post icone
    return (
        <Layout style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ backgroundColor: "#ADC8AD", borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                    <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                        {isPageVisible ? (
                            <Text style={{ color: "#0B7308", fontFamily: 'Poppins_600SemiBold_Italic', fontSize: normalize(30) }}>Aggiungi ingrediente</Text>
                        ) : (
                            <Text style={{ color: "#0B7308", fontFamily: 'Poppins_600SemiBold_Italic', fontSize: normalize(36) }}>Lista della spesa</Text>
                        )}
                    </View>
                </View>
                {isLoading && (
                    <View style={[styles.loadingContainer, { position: 'absolute', top: 10, right: 10 }]}>
                        <ActivityIndicator size="large" color="#000000" />
                    </View>

                )}
                <View style={styles.titleContainer}>
                    <View>
                        {isPageVisible === false ? (
                            <View style={{ flexDirection: "row" }}>
                                <View>
                                    <Text style={{ color: "black", fontSize: 22, fontFamily: 'Poppins_600SemiBold' }}>Totale: {totalPrice}€</Text>
                                </View>
                            </View>
                        ) : (
                            null
                        )}
                    </View>
                    <View style={styles.separator} />

                </View>
                {isPageVisible ? (
                    <View style={styles.listContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Input style={[styles.input, { flex: 1 }]} placeholder="Cerca ingrediente" value={searchText} onChangeText={handleSearch} textStyle={{ color: "black" }} ></Input>
                            <TouchableOpacity style={styles.totalContainer} onPress={handleSave}>
                                <Text style={[styles.totalText, { fontFamily: 'MyriadPro-Regular' }]}>Aggiungi</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ marginBottom: -50 }} showsVerticalScrollIndicator={false}>
                            {filteredIngredients.map((ingredient, index) => (
                                <View key={`name_${ingredient.id}`} style={[styles.itemContainer, (index === (filteredIngredients.length - 1)) && styles.lastItemContainer]}>
                                    <View style={styles.itemTextContainer}>
                                        <Text style={[styles.itemText, { color: "black", fontFamily: 'MyriadPro-Regular', }]}>{ingredient.name}</Text>
                                        <Text style={[styles.itemPrice, { color: "black", fontFamily: 'MyriadPro-Light', }]}>{ingredient.price}€</Text>
                                    </View>
                                    <View style={styles.buttonContainerAddMinus}>
                                        <TouchableOpacity style={styles.buttonMinus} onPress={() => handleRemoveIngredient(ingredient.id)}>
                                            <Image source={require('../../images/minus.png')} style={styles.icon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.buttonAdd} onPress={() => handleAddIngredient(ingredient.id)}>
                                            <Image source={require('../../images/plus.png')} style={styles.icon} />
                                            {quantities.find(item => item.id === ingredient.id)?.quantity > 0 && (
                                                <View style={styles.quantityNotification}>
                                                    <Text style={styles.quantityText}>
                                                        {quantities.find(item => item.id === ingredient.id)?.quantity}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={styles.listContainer}>
                            <ScrollView style={{ marginBottom: -50 }} showsVerticalScrollIndicator={false}>
                                {ingredients.length === 0 ? (
                                    <Text style={{ color: "black", fontFamily: 'Poppins_400Regular', textAlign: 'center' }}>Non sono presenti ingredienti nella lista della spesa</Text>
                                ) : (
                                    ingredients.map((item, index) => (
                                        item.quantity > 0 ?
                                            <View key={index}>
                                                {index === 0 || item.category !== ingredients[index - 1]?.category ? (
                                                    <View style={{ alignItems: 'center' }}>

                                                        <Text style={{ fontSize: normalize(16), textAlign: "center", color: "gray", fontFamily: 'Poppins_300Light' }}>{item.category}</Text>
                                                        <View style={[styles.separateCategory, { width: '60%' }]} />

                                                    </View>
                                                ) : null}

                                                <View key={item.id} style={[styles.itemContainer, (index === ingredients.length - 1) && styles.lastItemContainer]}>
                                                    <CheckBox style={styles.checkBox} checked={item.checked} onChange={() => handleToggle(item.id)} />
                                                    <View style={styles.itemTextContainer}>
                                                        <Text style={[styles.itemText, { fontFamily: 'Poppins_400Regular', color: item.checked === true ? "gray" : "black" }, item.checked === true ? styles.checkedText : null]}>
                                                            {item.nome}
                                                        </Text>
                                                        {prices.find(price => price.id === item.id) && (
                                                            <Text style={[styles.itemPrice, { fontFamily: 'Poppins_300Light', color: item.checked === true ? "gray" : "black" }, item.checked === true ? styles.checkedText : null]}>
                                                                {((ingredients.find(qty => qty.id === item.id)?.quantity) * prices.find(price => price.id === item.id).cost.toFixed(2)).toFixed(2)}€
                                                            </Text>
                                                        )}
                                                    </View>
                                                    <View>
                                                        <View style={styles.buttonContainerAddMinus}>
                                                            <TouchableOpacity style={[styles.buttonMinus, usingAsyncStorage ? { pointerEvents: "none" } : { pointerEvents: "auto" }]} onPress={() => handleRemoveChecklist(item.id)}>
                                                                <Image source={require('../../images/minus.png')} style={styles.icon} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={[styles.buttonAdd, usingAsyncStorage ? { pointerEvents: "none" } : { pointerEvents: "auto" }]} onPress={() => handleAddChecklist(item.id)}>
                                                                <Image source={require('../../images/plus.png')} style={styles.icon} />
                                                                {ingredients.find(qtyItem => qtyItem.id === item.id)?.quantity > 0 && (
                                                                    <View style={styles.quantityNotification}>
                                                                        <Text style={styles.quantityText}>
                                                                            {ingredients.find(qtyItem => qtyItem.id === item.id)?.quantity}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            :
                                            ""
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </View>
                )}
                <Animated.View style={{ flexDirection: "row", justifyContent: isPageVisible ? "center" : "space-around" }}>
                    <View>
                        {isPageVisible === false ? (
                            <View>
                                <TouchableOpacity style={[styles.bottomContainer, styles.checkContainer, usingAsyncStorage ? { pointerEvents: "none" } : { pointerEvents: "auto" }]} onPress={handleDispensa}>
                                    <Image source={require('../../images/check.png')} style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                    <Animated.View style={{ justifyContent: "center" }}>
                        <TouchableOpacity onPress={handleMainButtonAnimation} style={[styles.mainButton, usingAsyncStorage ? { pointerEvents: "none" } : { pointerEvents: "auto" }]}>
                            <Animated.View style={[styles.buttonContainer, { transform: [{ rotateZ: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }]}>
                                <Image source={isPageVisible ? require('../../images/times.png') : require('../../images/plus.png')} style={styles.iconBottom} />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </SafeAreaView>
        </Layout>
    );
}

const styles = StyleSheet.create({
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
        fontSize: normalize(16)
    },
    itemPrice: {
        fontSize: normalize(14)
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
        paddingTop: 10,
        paddingHorizontal: 20,
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