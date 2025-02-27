import { Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import { useTheme } from "../../themeContext";
import { useNavigation } from '@react-navigation/native';

const { width: deviceWidth, height: screenHeight } = Dimensions.get("window");

function MealPage() {
    const [username, setUsername] = useState("")
    const route = useRoute()
    const { item } = route.params
    const { theme } = useTheme()
    const [showAll, setShowAll] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const MAX_LENGTH = 300;

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

    const formatDescription = (text) => {
        const sentences = text.split(".");
        let groupedSentences = [];

        // Raggruppa ogni 2 frasi
        for (let i = 0; i < sentences.length; i += 2) {
            let chunk = sentences[i].trim();
            if (i + 1 < sentences.length) {
                chunk += ". " + sentences[i + 1].trim();
            }
            if (chunk) {
                groupedSentences.push(chunk + ".");
            }
        }

        return groupedSentences.map((group, index) => (
            <Text key={index} style={{ textAlign: "justify", fontFamily: "Poppins_400Regular", fontSize: 16, paddingBottom: 5 }}>
                {group}
            </Text>
        ));
    };

    const validLabels = ["preparazione", "cottura", "costo"]; // Campi da mostrare nella prima View
    const dosiPerLabel = "dosi per"; // Campo da mostrare accanto a "Ingredienti"

    // Filtra i dettagli
    const filteredDetails = item.details.filter(detail => validLabels.includes(detail.label.toLowerCase()));
    const dosiPerDetail = item.details.find(detail => detail.label.toLowerCase() === dosiPerLabel);


    //TODO: mettere loading immagine
    //TODO: mettere modo di aggiunta pasto alla settimana
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: theme.coloreScuro, fontSize: 36, fontFamily: "Poppins_600SemiBold_Italic", textAlign: "center" }}>{item.title.toUpperCase()}</Text>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ backgroundColor: "white", borderWidth: 1, borderColor: theme.coloreScuro, width: "auto", margin: 10, borderRadius: 15 }}>
                        <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 18, margin: 10 }}>{item.category}</Text>
                    </View>
                    <View style={{ backgroundColor: "white", borderWidth: 1, borderColor: theme.coloreScuro, width: "auto", margin: 10, borderRadius: 15 }}>
                        <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 18, margin: 10 }}>{item.details[0].value}</Text>
                    </View>
                </View>
                <View>
                    <Image source={{ uri: item.imageBase64 }} style={[styles.expandedImage, { width: "100%", borderColor: theme.coloreScuro, borderWidth: 1, borderRadius: 15, width: "95%", alignSelf: "center" }]}></Image>
                </View>
                {filteredDetails.length > 0 && (
                    <View style={{ backgroundColor: "white", borderWidth: 1, borderColor: theme.coloreScuro, width: "auto", margin: 10, borderRadius: 15 }}>
                        {filteredDetails.map((detail, index) => (
                            <View key={index} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ textAlign: "center", fontFamily: "Poppins_400Regular", fontSize: 16, padding: 10 }}>{detail.label}</Text>
                                <Text style={{ textAlign: "center", fontFamily: "Poppins_600SemiBold", fontSize: 16, padding: 10 }}>{detail.value}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <View style={{ backgroundColor: "white", borderWidth: 1, borderColor: theme.coloreScuro, width: "auto", margin: 10, borderRadius: 15 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ textAlign: "center", fontFamily: "Poppins_600SemiBold", fontSize: 18, padding: 10 }}>Ingredienti</Text>
                        {dosiPerDetail && (
                            <Text style={{ textAlign: "center", fontFamily: "Poppins_300Light", fontSize: 18, padding: 10, flexShrink: 1 }}>
                                {dosiPerDetail.label} {dosiPerDetail.value}
                            </Text>
                        )}
                    </View>
                    {item.ingredients.slice(0, showAll ? item.ingredients.length : 5).map((ingredient, index) => (
                        <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                            <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 16 }}>{ingredient[0]}</Text>
                            <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 16 }}>{ingredient[1]}</Text>
                        </View>
                    ))}
                    {item.ingredients.length > 5 && (
                        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={{ alignSelf: "center", marginTop: 10, backgroundColor: theme.coloreScuro, padding: 10, marginVertical: 10, borderRadius: 15 }}>
                            <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 16, color: "white" }}>
                                {showAll ? "Vedi di meno" : "Vedi di più"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ backgroundColor: "white", borderWidth: 1, borderColor: theme.coloreScuro, width: "auto", margin: 10, borderRadius: 15 }}>
                    <Text style={{ textAlign: "center", fontFamily: "Poppins_600SemiBold", fontSize: 18, padding: 10 }}>Descrizione</Text>

                    {/* Mostra solo i primi 200 caratteri se showFullDescription è false */}
                    <View style={{ paddingHorizontal: 10 }}>
                        {showFullDescription
                            ? formatDescription(item.description)
                            : formatDescription(item.description.substring(0, MAX_LENGTH) + "...")}
                    </View>

                    {/* Mostra il pulsante solo se la descrizione è più lunga di MAX_LENGTH caratteri */}
                    {item.description.length > MAX_LENGTH && (
                        <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)} style={{ alignSelf: "center", marginTop: 10, backgroundColor: theme.coloreScuro, padding: 10, marginVertical: 10, borderRadius: 15 }}>
                            <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 16, color: "white" }}>
                                {showFullDescription ? "Vedi di meno" : "Vedi di più"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    expandedImage: {
        width: "100%",
        height: screenHeight * 0.2,
        resizeMode: "cover",
        marginVertical: 10
    },
})

export default MealPage;