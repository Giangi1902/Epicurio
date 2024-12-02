import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import { View, StatusBar, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { normalize } from "./home";

function Diet() {

    return (
        <Layout style={styles.container}>
            <StatusBar translucent={true} backgroundColor={'#ADC8AD'} barStyle={"dark-content"} />

            <View style={{ backgroundColor: "#ADC8AD", borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
                <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
                    <Text style={{ color: "#0B7308", fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic" }}>Diete</Text>
                </View>
            </View>

            {/* View per la dieta principale  */}
            <ScrollView style={styles.scrollViewDiete}>
                <View style={[styles.cardDietaPrincipale, { marginTop: 15, paddingBottom: 10 }]}>
                    <Text style={{ alignSelf: "center", color: "black", fontFamily: "Poppins_600SemiBold", fontSize: normalize(22) }}>La tua dieta</Text>

                    <View style={[styles.cardDietaPrincipale, { borderColor: "#0B7308", marginVertical: 15 }]}>
                        <Text style={styles.titleDietaPrincipale}>Dieta mediterranea</Text>
                        <Text style={styles.descriptionDietaPrincipale}>Descrizione della dieta attualmente scelta lorem ipsum dolor sit amet lorem ipsum dolor sit amet</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end" }}>
                        <TouchableOpacity>
                            <View style={{ marginHorizontal: 10 }}>
                                <Image source={require("../../images/right-arrow.png")} style={{ width: 35, height: 35, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: normalize(16), color: "black", alignSelf: "center", marginTop: 25 }}>Scegli un'altra dieta tra quelle possibili</Text>
                <View style={styles.viewDiete}>
                    <View style={styles.cardDieta}>
                        <Text style={styles.titleDieta}>Dieta Chetogenica</Text>
                        <Text style={styles.descriptionDieta}>Descrizione della dieta che è possibile scegliere tra tutte quelle disponibili</Text>

                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Image source={require("../../images/right-arrow.png")} style={{ width: 20, height: 20, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardDieta}>
                        <Text style={styles.titleDieta}>Dieta Detox</Text>
                        <Text style={styles.descriptionDieta}>Descrizione della dieta che è possibile scegliere tra tutte quelle disponibili</Text>
                        
                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Image source={require("../../images/right-arrow.png")} style={{ width: 20, height: 20, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardDieta}>
                        <Text style={styles.titleDieta}>Dieta Chetogenica</Text>
                        <Text style={styles.descriptionDieta}>Descrizione della dieta che è possibile scegliere tra tutte quelle disponibili</Text>
                        
                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Image source={require("../../images/right-arrow.png")} style={{ width: 20, height: 20, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardDieta}>
                        <Text style={styles.titleDieta}>Dieta Detox</Text>
                        <Text style={styles.descriptionDieta}>Descrizione della dieta che è possibile scegliere tra tutte quelle disponibili</Text>

                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Image source={require("../../images/right-arrow.png")} style={{ width: 20, height: 20, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardDieta}>
                        <Text style={styles.titleDieta}>Dieta Chetogenica</Text>
                        <Text style={styles.descriptionDieta}>Descrizione della dieta che è possibile scegliere tra tutte quelle disponibili</Text>

                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Image source={require("../../images/right-arrow.png")} style={{ width: 20, height: 20, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardDieta}>
                        <Text style={styles.titleDieta}>Dieta Detox</Text>
                        <Text style={styles.descriptionDieta}>Descrizione della dieta che è possibile scegliere tra tutte quelle disponibili</Text>

                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Image source={require("../../images/right-arrow.png")} style={{ width: 20, height: 20, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

        </Layout>
    )
}

//api di spoonacular

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    cardDietaPrincipale: {
        flex: 1,
        width: "90%",
        backgroundColor: "white",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 2,
        elevation: 3,
        borderColor: "#E2E8F0",
        borderWidth: 1
    },
    scrollViewDiete: {
        flex: 1
    },
    titleDietaPrincipale: {
        fontFamily: "Poppins_500Medium",
        fontSize: normalize(18),
        color: "#0B7308",
        alignSelf: "center",
        marginTop: 5
    },
    descriptionDietaPrincipale: {
        fontFamily: "Poppins_400Regular",
        fontSize: normalize(13),
        color: "black",
        padding: 10,
    },
    viewDiete: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        marginHorizontal: 10
    },
    cardDieta: {
        width: "45%",
        alignSelf: "center",
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 2,
        elevation: 3,
        paddingVertical: 15,
        marginVertical: 10,
        borderColor: "#E2E8F0",
        borderWidth: 1
    },
    titleDieta: {
        fontFamily: "Poppins_400Regular",
        fontSize: normalize(14),
        alignSelf: "center",
        color: "#0B7308"
    },
    descriptionDieta: {
        fontFamily: "Poppins_300Light",
        fontSize: normalize(12),
        padding: 10,
        color: "black"
    }
})

export default Diet