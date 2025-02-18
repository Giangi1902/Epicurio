import { Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import { useTheme } from "../../themeContext";
import { useNavigation } from '@react-navigation/native';



function MealPage() {
    const [username, setUsername] = useState("")
    const [dispensa, setDispensa] = useState([])
    const [meals, setMeals] = useState([])
    const route = useRoute()
    const { id } = route.params
    const { theme } = useTheme()


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
    }, [username]);



    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: theme.coloreScuro, fontSize: 36, fontFamily: "Poppins_600SemiBold_Italic" }}>{categoria.toUpperCase()}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
})

export default MealPage;