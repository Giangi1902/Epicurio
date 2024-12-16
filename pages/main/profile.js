import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Image, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Layout, Text } from "@ui-kitten/components";
import { normalize } from "./home";

const { width: screenWidth } = Dimensions.get('window');
const circleSize = screenWidth * 0.55;

function Profile() {
    const [orariopranzo, setOrarioPranzo] = useState("");
    const [orariocena, setOrarioCena] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleInfo = async () => {
        if (username !== "") {
            try {
                setLoading(true);
                const response = await axios.get(`http://192.168.1.123:8080/getInfo/${username}`);
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
            const response = await axios.delete(`http://192.168.1.123:8080/deleteAccount/${username}`);
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
            <View style={styles.containerTitle}>
                <View style={styles.containerTitleText}>
                    <Text style={styles.textTitle}>Profilo</Text>
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
                    <ScrollView>
                        <View style={styles.profileContainer}>
                            <View style={styles.circleContainer}>
                                <Image source={require('../../images/profile.png')} style={styles.circleImage} />
                            </View>
                            <Text style={styles.usernameText}>{username}</Text>
                            <View style={styles.separator} />
                            <View style={styles.containerDescription}>
                                <Text style={styles.infoText}>Orario di pranzo:</Text>
                                <Text style={styles.descriptionText}>{orariopranzo}</Text>
                            </View>
                            <View style={styles.containerDescription}>
                                <Text style={styles.infoText}>Orario di cena:</Text>
                                <Text style={styles.descriptionText}>{orariocena}</Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
                <View style={styles.separator} />
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.titleButton}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Text style={styles.titleButton}>Elimina account</Text>
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
        height: 1,
        backgroundColor: 'black',
        marginVertical: 10,
    },
    titleButton: {
        color: "white",
        fontSize: 20,
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
        backgroundColor: "#ADC8AD",
        borderBottomRightRadius: 45,
        borderBottomLeftRadius: 45
    },
    textTitle: {
        color: "#0B7308",
        fontSize: normalize(36),
        fontFamily: "Poppins_600SemiBold_Italic"
    },
    scrollViewContainer: {
        width: "90%",
        alignSelf: "center"
    }
});

export default Profile;
