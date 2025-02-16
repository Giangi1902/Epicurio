import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";

const { width: deviceWidth, height: screenHeight } = Dimensions.get("window");

const ImageDetails = ({ route }) => {
  const { image, title, description, category } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.category}>Categoria: {category}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: deviceWidth * 0.9,
    height: screenHeight * 0.5,
    borderRadius: 15,
    resizeMode: "cover",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  category: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});

export default ImageDetails;
