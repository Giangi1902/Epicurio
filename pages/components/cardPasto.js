import { Text } from "@ui-kitten/components";
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet} from "react-native";
import { normalize } from "../main/home";

function CardPasto({text}) {

    return (
        <View style={styles.cardPasto}>
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15 }}>
                <Text style={styles.dayText}>{text}</Text>
                <Image source={require("../../images/plusblack.png")} style={styles.iconContainer}></Image>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    dayText: {
        color: "#0B7308",
        fontFamily: "Poppins_500Medium",
        alignSelf: "center",
        fontSize: normalize(14)
    },
    iconContainer: {
        height: 15,
        width: 15,
        alignSelf: "center"
    },
    cardPasto: {
        width: "80%",
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
        borderColor: "#097373",
        borderWidth: 1
    },
});

export default CardPasto

