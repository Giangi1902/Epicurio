import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, StatusBar, Platform, ActivityIndicator, TextInput, ScrollView, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Layout, Text } from "@ui-kitten/components";
import { normalize } from "./home";
import axios from "axios";
import { useTheme } from "../../themeContext";

const { width: deviceWidth, height: screenHeight } = Dimensions.get("window");

const TinderSwipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    handleCards();
  }, []);

  useEffect(() => {
    console.log("Current Index:", currentIndex);
  }, [currentIndex]);


  const handleCards = async () => {
    try {
      const response = await axios.get(`http://172.20.10.7:8080/getCards`);
      if (response.data !== "no") {
        const formattedImages = response.data.map(item => ({ image: item.imageBase64, title: item.title, description: item.description, category: item.category, details: item.details, ingredients: item.ingredients }));
        setImages(formattedImages);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwiped = (cardIndex) => {
    setCurrentIndex(cardIndex + 1);
  };
  const handleTap = () => {
    setIsExpanded(true);
  };

  //TODO: sistemare background
  //TODO: bug index quando torna da handletap
  //TODO: animazione di quando si espande la card
  return (
    <Layout style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'#ADC8AD'} barStyle={"dark-content"} />

      {/* Header */}
      <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
        <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
          <Text style={{ color: theme.coloreScuro, fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic" }}>Finder</Text>
        </View>
      </View>

      {!isExpanded && (
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <TextInput style={{ width: deviceWidth * 0.95, height: 45, backgroundColor: "white", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", paddingLeft: 15, fontSize: normalize(12), fontFamily: "Poppins_500Medium" }}
            placeholder="Cerca una ricetta..."
            placeholderTextColor="#A0A0A0"
          />
        </View>
      )}

      {/* Swiper Section */}
      <View style={styles.viewContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0B7308" />
        ) : (
          images.length > 0 ? (
            isExpanded ? (
              // Informazioni sulla ricetta espansa
              <ScrollView style={styles.scrollView}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
                  <TouchableOpacity style={{ backgroundColor: "black", borderRadius: 10, width: 40, height: 40, justifyContent: "center", alignItems: "center", marginBottom: 15, marginHorizontal: 15 }} onPress={() => setIsExpanded(false)}>
                    <Image source={require("../../images/times.png")} style={{ width: 20, height: 20, tintColor: "white" }} />
                  </TouchableOpacity>
                  <Text style={[styles.title, { textAlign: "center" }]}>{images[currentIndex].title}</Text>
                </View>
                <Image source={{ uri: images[currentIndex].image }} style={[styles.expandedImage, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#E2E8F0" }]} />
                <Text style={styles.category}>Categoria: {images[currentIndex].category}</Text>

                <Text style={styles.subtitle}>Ingredienti:</Text>
                <Text style={styles.description}>{images[currentIndex].ingredients}</Text>

                <Text style={styles.subtitle}>Preparazione:</Text>
                <Text style={styles.description}>{images[currentIndex].description}</Text>

                <TouchableOpacity style={styles.closeButton} onPress={() => { setIsExpanded(false); }}>
                  <Text style={styles.closeButtonText}>Chiudi</Text>
                </TouchableOpacity>
              </ScrollView>
            )
              :
              <>
                {/* Card in background */}
                {currentIndex + 1 < images.length && (
                  <View style={[styles.backgroundCard, {borderColor: theme.coloreScuro}]}>
                    <Text style={styles.titleBackground}>{images[currentIndex + 1].title}</Text>

                    <Image
                      source={{ uri: images[currentIndex + 1].image }}
                      style={styles.backgroundImage}
                    />
                  </View>
                )}

                {/* Card principale */}
                <Swiper
                  cards={images}
                  cardIndex={currentIndex}
                  renderCard={(card) => (
                    <View style={{
                      backgroundColor: "#F3F4F6",
                      borderRadius: 15,
                      width: deviceWidth * 0.95,
                      overflow: Platform.OS === "android" ? "hidden" : "visible",
                      borderColor: theme.coloreScuro,
                      borderWidth: 1,
                      position: "absolute",
                      alignSelf: "center",

                      // Ombra per Android
                      elevation: 4,

                      // Ombra per iOS
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 6,
                    }}>

                      <View style={[styles.card]}>
                        <Text style={styles.title}>{card.title}</Text>
                        <Image source={{ uri: card.image }} style={styles.image} />
                      </View>

                      <View style={[styles.descriptionCard, { marginTop: 10, flex: 1, flexDirection: "row" }]}>
                        <Text style={styles.description}>Categoria: </Text>
                        <Text style={[styles.description, { fontFamily: "Poppins_600SemiBold" }]}>{images[currentIndex].category}</Text>
                      </View>

                    </View>

                  )}
                  onSwiped={handleSwiped}
                  onSwipedLeft={(cardIndex) => console.log("Swiped left", cardIndex)}
                  onSwipedRight={(cardIndex) => console.log("Swiped right", cardIndex)}
                  onTapCard={handleTap}
                  backgroundColor="transparent"
                  animateCardOpacity={true}
                  stackSize={4}
                  cardVerticalMargin={10}
                  cardHorizontalMargin={0}
                  disableBottomSwipe={true}
                  disableTopSwipe={true}
                />
              </>
          ) : (
            <Text style={{ textAlign: "center", fontSize: 18, color: "gray" }}>Nessuna immagine disponibile</Text>
          )
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 5
  },
  card: {
    width: deviceWidth * 0.94,
    height: screenHeight * 0.5,
    borderRadius: 15,
    backgroundColor: "white",
    alignSelf: "center",
    padding: 10,
    position: "relative"
  },
  descriptionCard: {
    borderRadius: 15,
    width: deviceWidth * 0.94,
    backgroundColor: "white",
    alignSelf: "center",
    padding: 10,
    position: "relative"
  },
  backgroundCard: {
    position: "absolute",
    width: deviceWidth * 0.94,
    height: screenHeight * 0.5,
    opacity: 0.4,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "75%",
    borderRadius: 10,
    overflow: "hidden",
  },
  title: {
    fontSize: 22,
    marginTop: 15,
    marginBottom: 25,
    color: "black",
    fontFamily: "Poppins_600SemiBold",
    alignSelf: "center",
  },
  titleBackground: {
    fontSize: 16,
    marginTop: "10%",
    color: "black",
    fontFamily: "Poppins_600SemiBold_Italic"
  },
  description: {
    fontSize: 16,
    marginVertical: 5,
    color: "black",
    fontFamily: "Poppins_400Regular"
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    opacity: 0.5,
    resizeMode: "contain",
  },
  expandedImage: {
    width: "100%",
    height: screenHeight * 0.4,
    resizeMode: "cover",
  },
  category: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    paddingVertical: 20,
  },
  closeButton: {
    backgroundColor: "#0B7308",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
});

export default TinderSwipe;