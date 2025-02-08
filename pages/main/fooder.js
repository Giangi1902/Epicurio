import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Layout, Text } from "@ui-kitten/components";
import { normalize } from "./home";

const images = [
  { image: require("../../images/alarm-clock.png") },
  { image: require("../../images/meat.png") },
  { image: require("../../images/food.png") },
];

const { width: deviceWidth, height: screenHeight } = Dimensions.get("window");

const cardHeight = Platform.OS === "ios" ? screenHeight * 0.7 : screenHeight * 0.78;

const TinderSwipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwiped = (cardIndex) => {
    setCurrentIndex(cardIndex + 1);
  };

  return (
    <Layout style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'#ADC8AD'} barStyle={"dark-content"} />

      {/* Header */}
      <View style={{ backgroundColor: "#ADC8AD", borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
        <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
          <Text style={{ color: "#0B7308", fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic" }}>Finder</Text>
        </View>
      </View>


      {/* Swiper Section */}
      <View style={styles.viewContainer}>
        {currentIndex + 1 < images.length && (
          <View style={styles.backgroundCard}>
            <Image
              source={images[currentIndex + 1].image}
              style={styles.backgroundImage}
            />
          </View>
        )}
        <Swiper
          cards={images}
          renderCard={(card) => (
            <View style={[styles.card, { height: cardHeight }]}>
              <Image source={card.image} style={styles.image} />
            </View>
          )}
          onSwiped={handleSwiped}
          onSwipedLeft={(cardIndex) => console.log("Swiped left", cardIndex)}
          onSwipedRight={(cardIndex) => console.log("Swiped right", cardIndex)}
          backgroundColor="transparent"
          animateCardOpacity={true}
          stackSize={2}
          cardVerticalMargin={10}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#ADC8AD",
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
    paddingVertical: 10,
  },
  headerTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  headerText: {
    color: "#0B7308",
    fontSize: 36,
    fontFamily: "Poppins_600SemiBold_Italic",
  },
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    width: deviceWidth * 0.9,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 5,
  },
  backgroundCard: {
    position: "absolute",
    width: deviceWidth * 0.85,
    height: screenHeight * 0.65,
    opacity: 0.4,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "contain",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    opacity: 0.5,
    resizeMode: "contain",
  },
});

export default TinderSwipe;
