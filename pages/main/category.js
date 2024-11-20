import { Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import DiagonalBackground from "./diagonalbackground";

function Category() {
    const [username, setUsername] = useState("")
    const [dispensa, setDispensa] = useState([])
    const [meals, setMeals] = useState([])
    const route = useRoute()
    const { categoria } = route.params

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
        handleIngredients();
        handleMeals()
    }, [username]);

    const handleIngredients = async () => {
        if (username != "") {
            try {
                const response = await axios.get(`https://my-expense-five.vercel.app/categoryIngredients/${username}/${categoria}`)
                if (response.data != "no") {
                    setDispensa(response.data)
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    const handleMeals = async () => {
        try {
            const response = await axios.get(`https://my-expense-five.vercel.app/getMealsCategory/${categoria}`)
            setMeals(response.data)
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleMinus = async (id) => {
        // Verifica che la quantità da sottrarre sia maggiore o uguale a zero
        const itemToUpdate = dispensa.find(item => item.id === id);
        if (itemToUpdate?.quantity >= 1) {
            try {
                // Aggiorna immediatamente la quantità nel frontend
                const updatedDispensa = dispensa.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                });
                setDispensa(updatedDispensa);

                // Invia la richiesta di aggiornamento al backend
                const response = await axios.put(`https://my-expense-five.vercel.app/updateIngredientQuantity/${id}`, { quantity: -1, username });
                if (!response.data) {
                    console.log("Errore nell'aggiornamento della quantità nel backend");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handlePlus = async (id) => {
        try {
            // Aggiorna immediatamente la quantità nel frontend
            const updatedDispensa = dispensa.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            setDispensa(updatedDispensa);

            // Invia la richiesta di aggiornamento al backend
            const response = await axios.put(`https://my-expense-five.vercel.app/updateIngredientQuantity/${id}`, { quantity: 1, username });
            if (!response.data) {
                console.log("Errore nell'aggiornamento della quantità nel backend");
            }
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <View style={styles.container}>
            <DiagonalBackground
                imageSize={30} // Dimensione di ogni piccola immagine
                spacing={15}
                opacity={0.3}
                categoria={categoria}
            />
            <View style={styles.title}>
                <Text style={{ color: "black", fontSize: 28, fontFamily: "MyriadPro-Bold", alignSelf: "center" }}>{categoria.toUpperCase()}</Text>
            </View>
            <View style={styles.listContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        {dispensa.map((item, index) => (
                            <View key={index}>
                                <View key={item.id} style={[styles.itemContainer]}>
                                    <View style={styles.itemTextContainer}>
                                        <Text style={[{ fontFamily: 'MyriadPro-Regular', color: "black", fontSize: 18 }]}>
                                            {item.name}
                                        </Text>
                                    </View>
                                    <View>
                                        <View style={styles.buttonContainerAddMinus}>
                                            <TouchableOpacity style={styles.buttonMinus} onPress={() => handleMinus(item.id)}>
                                                <Image source={require('../../images/minus.png')} style={styles.icon} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.buttonAdd} onPress={() => handlePlus(item.id)}>
                                                <Image source={require('../../images/plus.png')} style={styles.icon} />
                                                {dispensa.find(qtyItem => qtyItem.id === item.id)?.quantity >= 0 && (
                                                    <View style={styles.quantityNotification}>
                                                        <Text style={styles.quantityText}>
                                                            {dispensa.find(qtyItem => qtyItem.id === item.id)?.quantity}
                                                        </Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.card}>
                        <Text style={{ color: "black", fontSize: 24, fontFamily: "MyriadPro-Bold", alignSelf: "center", marginBottom: 10 }}>Componi queste ricette</Text>
                        {meals.length > 0 ?
                            meals.map((item, index) => (
                                <View key={index}>
                                    <Text style={{ color: "black", fontSize: 16, fontFamily: "MyriadPro-Regular" }}>{item.nome}</Text>
                                    <Text style={{ color: "black", fontSize: 16, fontFamily: "MyriadPro-Light" }}>Ingredienti: {item.ingredients.join(', ')}</Text>
                                    <Text style={{ color: "black", fontSize: 16, fontFamily: "MyriadPro-Light" }}>Prezzo: {item.price}€</Text>
                                    <View style={[styles.separator, { alignSelf: "center" }]}></View>
                                </View>
                            ))
                            : <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", alignSelf: "center" }}>Non sono presenti ricette!</Text>
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
        backgroundColor: "#FFF7E8",
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
        marginBottom: 40
    },
    title: {
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        paddingVertical: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover", // Puoi anche provare "repeat" se la tua immagine lo supporta
        transform: [{ rotate: '45deg' }], // Ruota l'immagine di 45 gradi
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
        justifyContent: 'space-between',
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
        paddingHorizontal: 20,
        marginTop: 30
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

export default Category