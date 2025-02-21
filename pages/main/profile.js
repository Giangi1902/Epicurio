import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Image, Dimensions, TouchableOpacity, ScrollView, DevSettings } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Layout, Text } from "@ui-kitten/components";
import { normalize } from "./home";
import { useTheme } from "../../themeContext";


const { width: screenWidth } = Dimensions.get('window');
const circleSize = screenWidth * 0.25;

function Profile() {
    const [orariopranzo, setOrarioPranzo] = useState("");
    const [orariocena, setOrarioCena] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { toggleTheme } = useTheme();
    const { theme } = useTheme();


    const handleInfo = async () => {
        if (username !== "") {
            try {
                setLoading(true);
                const response = await axios.get(`http://192.168.1.89:8080/getInfo/${username}`);
                if (response.data !== "nonesiste") {
                    setOrarioPranzo(response.data.orario_pranzo);
                    setOrarioCena(response.data.orario_cena);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
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
            const response = await axios.delete(`http://192.168.1.89:8080/deleteAccount/${username}`);
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
            <View style={[styles.containerTitle, { backgroundColor: theme.coloreChiaro }]}>
                <View style={styles.containerTitleText}>
                    <Text style={[styles.textTitle, { color: theme.coloreScuro }]}>Profilo</Text>
                </View>
            </View>
            <ScrollView style={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.profileContainer}>
                        <ActivityIndicator size="large" color="#000000" />
                        <View style={styles.separator} />
                    </View>
                ) : username === "" ? (
                    <Text>Username non esistente</Text>
                ) : (
                    <View style={styles.profileContainer}>
                        <View style={styles.circleContainer}>
                            <Image source={require('../../images/profile.png')} style={styles.circleImage} />
                        </View>
                        <Text style={styles.usernameText}>{username}</Text>
                        <View style={styles.listContainer}>
                            <View style={[styles.cardAddIngredient, { borderColor: theme.coloreScuro, borderWidth: 1 }]}>
                                <View style={styles.containerDescription}>
                                    <Text style={styles.infoText}>Orario di pranzo:</Text>
                                    <Text style={styles.descriptionText}>{orariopranzo}</Text>
                                </View>
                                <View style={styles.containerDescription}>
                                    <Text style={styles.infoText}>Orario di cena:</Text>
                                    <Text style={styles.descriptionText}>{orariocena}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                <View style={styles.listContainer}>
                    <View style={[styles.cardAddIngredient, { borderColor: theme.coloreScuro, borderWidth: 1 }]}>
                        <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 18, textAlign: "center" }}>Cambia tema all'applicazione </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
                            <TouchableOpacity onPress={() => toggleTheme("green")}>
                                <View style={{ backgroundColor: "#ADC8AD", borderRadius: 25, width: 50, height: 50 }}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleTheme("purple")}>
                                <View style={{ backgroundColor: "#C7ADC8", borderRadius: 25, width: 50, height: 50 }}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleTheme("blue")}>
                                <View style={{ backgroundColor: "#ADC8C8", borderRadius: 25, width: 50, height: 50 }}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleTheme("red")}>
                                <View style={{ backgroundColor: "#C8ADAD", borderRadius: 25, width: 50, height: 50 }}></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                            <Text style={styles.titleButton}>Elimina</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                            <Text style={styles.titleButton}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    listContainer: {
        flex: 1,
        paddingTop: 10,
        width: screenWidth * 0.95,
        marginTop: 5,
        alignSelf: "center"
    },
    logoutButton: {
        marginVertical: 10,
        width: "40%",
        backgroundColor: '#407F40',
        borderRadius: 20,
        alignSelf: "center",
        justifyContent: "center",
        padding: 10
    },
    deleteButton: {
        marginVertical: 10,
        width: "40%",
        backgroundColor: '#9B0800',
        borderRadius: 20,
        alignSelf: "center",
        justifyContent: "center",
        padding: 10
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: 'black',
        marginVertical: 10,
    },
    titleButton: {
        color: "white",
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        alignSelf: "center",
        justifyContent: "center"
    },
    containerDescription: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
        marginVertical: 10
    },
    containerTitleText: {
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "center",
        marginVertical: 10
    },
    containerTitle: {
        borderBottomRightRadius: 45,
        borderBottomLeftRadius: 45
    },
    textTitle: {
        fontSize: normalize(36),
        fontFamily: "Poppins_600SemiBold_Italic"
    },
    scrollViewContainer: {
        flex: 1,
        width: "95%",
        alignSelf: "center"
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
        marginBottom: 5
    },
});

export default Profile;
