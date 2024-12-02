import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Image, Dimensions, TouchableOpacity, PixelRatio, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Layout, Text, Button } from "@ui-kitten/components";

const { width: screenWidth } = Dimensions.get('window');
const circleSize = screenWidth * 0.55;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
    const newSize = size * scale
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}


function Profile() {
    const [orariopranzo, setOrarioPranzo] = useState("");
    const [orariocena, setOrarioCena] = useState("");
    const [market, setMarket] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false); // State per il loader
    const navigation = useNavigation();

    const handleInfo = async () => {
        if (username !== "") {
            try {
                setLoading(true); // Attiva il loader durante il fetch
                const response = await axios.get(`https://my-expense-five.vercel.app/getInfo/${username}`);
                if (response.data === "nonesiste") {
                    // Gestione caso in cui l'utente non esiste
                } else {
                    setOrarioPranzo(response.data.orario_pranzo);
                    setOrarioCena(response.data.orario_cena);
                    setMarket(response.data.market);
                }
            } catch (error) {
                console.log(error);
                // Gestione dell'errore
            } finally {
                setLoading(false); // Disattiva il loader dopo il fetch
            }
        }
    };

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
        handleInfo();
    }, [username]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("username");
            navigation.navigate("Auth");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`https://my-expense-five.vercel.app/deleteAccount/${username}`);
            if (response.data === "ok") {
                await AsyncStorage.removeItem("username");
                navigation.navigate("Auth");
            } else {
                alert("Errore nell'eliminazione dell'account");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout style={styles.container}>
            <View style={{ backgroundColor: "#ADC8AD", borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: "#0B7308", fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic", marginHorizontal: -5 }}>Profilo</Text>
                </View>
            </View>
            <ScrollView style={{width: "90%", alignSelf: "center"}} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.profileContainer}>
                        <ActivityIndicator size="large" color="#000000" />
                        <View style={styles.separator} />
                    </View>
                ) : username === "" ? (
                    <Text>Username non esistente</Text>
                ) : (
                    <ScrollView>
                        <View style={styles.profileContainer}>
                            <View style={styles.circleContainer}>
                                <Image source={require('../../images/profile.png')} style={styles.circleImage} />
                            </View>
                            <Text style={styles.usernameText}>{username}</Text>
                            <View style={styles.separator} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: '100%', marginVertical: 10 }}>
                                <Text style={styles.infoText}>Orario di pranzo:</Text>
                                <Text style={styles.descriptionText}>{orariopranzo}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: '100%', marginVertical: 10 }}>
                                <Text style={styles.infoText}>Orario di cena:</Text>
                                <Text style={styles.descriptionText}>{orariocena}</Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
                <View style={styles.separator} />
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={{ color: "white", fontSize: 20, fontFamily: "Poppins_500Medium", alignSelf: "center", justifyContent: "center" }}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Text style={{ color: "white", fontSize: 20, fontFamily: "Poppins_500Medium", alignSelf: "center", justifyContent: "center" }}>Elimina account</Text>
                </TouchableOpacity>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6"
    },
    profileContainer: {
        alignItems: 'center',
        width: '100%',
    },
    circleContainer: {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        overflow: 'hidden',
        marginVertical: 20,
    },
    circleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    usernameText: {
        color: "black",
        fontFamily: "Poppins_600SemiBold",
        fontSize: 28,
        marginBottom: 10,
    },
    infoText: {
        color: "black",
        fontFamily: "Poppins_400Regular",
        marginVertical: 5,
        fontSize: 18,
    },
    descriptionText: {
        color: "black",
        fontFamily: "Poppins_600SemiBold",
        marginVertical: 5,
        fontSize: 18,
        textAlign: 'right',
    },
    logoutButton: {
        marginVertical: 10,
        width: "100%",
        height: circleSize / 4,
        backgroundColor: '#407F40',
        borderRadius: 20,
        alignSelf: "center",
        justifyContent: "center"
    },
    deleteButton: {
        marginVertical: 10,
        width: "100%",
        height: circleSize / 4,
        backgroundColor: '#9B0800',
        borderRadius: 20,
        alignSelf: "center",
        justifyContent: "center"
    },
    separator: {
        width: '100%',
        height: 1, // Increased height for better visibility
        backgroundColor: 'black', // Changed color for testing
        marginVertical: 10,
    },
});

export default Profile;
