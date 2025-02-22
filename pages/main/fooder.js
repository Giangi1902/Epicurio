import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, StatusBar, Platform, ActivityIndicator, TextInput, ScrollView, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Layout, Text } from "@ui-kitten/components";
import { normalize } from "./home";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../../themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: deviceWidth, height: screenHeight } = Dimensions.get("window");

const TinderSwipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const navigation = useNavigation()
  const [username, setUsername] = useState("")

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
  }, []);

  useEffect(() => {
    handleCards()
  }, [])

  useEffect(() => {
    if (images.length - currentIndex <= 5 && !loading) {
      handleCards();
    }
  }, [currentIndex, images.length, loading]);

  const handleCards = async () => {
    try {
      const response = await axios.get(`http://192.168.1.89:8080/getCards`);
      setImages(prevImages => [...prevImages, ...response.data]); // Aggiunge le nuove card in coda
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwiped = (cardIndex) => {
    setCurrentIndex(cardIndex + 1);
  };
  const handleTap = async (item) => {
    try {
      navigation.navigate("Finder", {
        screen: "MealPage",
        params: { item },
      });
    }
    catch (e) {
      console.log(e)
    }
  };

  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const words = query.trim().split(/\s+/);
    const hasValidWord = words.some(word => word.length >= 3);

    if (hasValidWord) {
      handleSearch(query);
    } else {
      setFilteredData([]);
    }
  }, [query]);

  const handleSearch = async (searchQuery) => {
    try {
      const response = await axios.get(`http://192.168.1.89:8080/searchMeal?query=${searchQuery}`);
      setFilteredData(response.data);
    } catch (error) {
      console.log("Errore nella ricerca:", error);
    }
  };

  const handleSwipeLeft = async(cardIndex) => {
    try{
      const item = images[cardIndex]
      const response = await axios.post(`http://192.168.1.89:8080/swipeLeft/${username}`, {item})
    }
    catch(e){
      console.log(e)
    }
  }

  const handleSwipeRight = async(cardIndex) => {
    try{
      const item = images[cardIndex]
      const response = await axios.post(`http://192.168.1.89:8080/swipeRight/${username}`, {item})
    }
    catch(e){
      console.log(e)
    }
  }

  //TODO: aggiungere logica destra e sinistra
  //TODO: prendere altre immagini quando ne mancano 5 
  return (
    <Layout style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'#ADC8AD'} barStyle={"dark-content"} />

      {/* Header */}
      <View style={{ backgroundColor: theme.coloreChiaro, borderBottomRightRadius: 45, borderBottomLeftRadius: 45 }}>
        <View style={{ alignItems: "center", flexDirection: "row", alignSelf: "center", marginVertical: 10 }}>
          <Text style={{ color: theme.coloreScuro, fontSize: normalize(36), fontFamily: "Poppins_600SemiBold_Italic" }}>Finder</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between", marginHorizontal: 10 }}>
        <TextInput style={{ width: "85%", height: 45, backgroundColor: "white", borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", paddingLeft: 15, fontSize: normalize(12), fontFamily: "Poppins_500Medium" }}
          placeholder="Cerca un ingrediente..."
          placeholderTextColor="#A0A0A0"
          onChangeText={setQuery}
          value={query}
        />
        <TouchableOpacity onPress={() => setQuery("")} style={{ height: 45, width: 45, backgroundColor: theme.coloreScuro, borderRadius: 15, alignItems: "center", justifyContent: "center" }}>
          <Image source={require("../../images/times.png")} style={{ width: 20, height: 20 }}></Image>
        </TouchableOpacity>
      </View>

      {/* Swiper Section */}
      <View style={styles.viewContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.coloreScuro} />
        ) : (
          <>
            {query == "" ? (
              <>
                {currentIndex + 1 < images.length && (
                  <View style={[styles.backgroundCard, { borderColor: theme.coloreScuro }]}>
                    <Text style={styles.titleBackground}>{images[currentIndex + 1].title}</Text>

                    <Image
                      source={{ uri: images[currentIndex + 1].imageBase64 }}
                      style={styles.backgroundImage}
                    />
                  </View>
                )}

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
                        <Image source={{ uri: card.imageBase64 }} style={styles.image} />
                      </View>

                      <View style={[styles.descriptionCard, { marginTop: 10, flex: 1, flexDirection: "row" }]}>
                        <Text style={styles.description}>Categoria: </Text>
                        <Text style={[styles.description, { fontFamily: "Poppins_600SemiBold" }]}>{images[currentIndex].category}</Text>
                      </View>

                    </View>

                  )}
                  onSwiped={handleSwiped}
                  onSwipedLeft={(cardIndex) => handleSwipeLeft(cardIndex)}
                  onSwipedRight={(cardIndex) => handleSwipeRight(cardIndex)}
                  onTapCard={() => handleTap(images[currentIndex])}
                  backgroundColor="transparent"
                  animateCardOpacity={true}
                  stackSize={4}
                  cardVerticalMargin={10}
                  cardHorizontalMargin={0}
                  disableBottomSwipe={true}
                  disableTopSwipe={true}
                />
              </>)
              :
              <View style={styles.listContainer}>
                <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
                  <View style={[styles.cardAddIngredient, { borderColor: theme.coloreScuro, borderWidth: 1 }]}>


                    {filteredData.map((item, index) => (

                      <TouchableOpacity key={index} onPress={() => handleTap(item)}>
                        <View key={item.id} style={[styles.itemContainer]}>
                          <View style={styles.itemTextContainer}>
                            <Image
                              source={{ uri: item.imageBase64 }}
                              style={{ height: 100, width: 100, backgroundColor: theme.coloreScuro }}
                            />
                            <Text style={[{ fontFamily: 'Poppins_300Light', color: "black", fontSize: 16, padding: 15, flex: 1 }]}>
                              {item.title}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            }
          </>
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
    height: screenHeight * 0.55,
    borderRadius: 15,
    backgroundColor: "white",
    alignSelf: "center",
    padding: 10,
    position: "relative"
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginBottom: 40
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
    width: deviceWidth * 0.95,
    alignSelf: "center"
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