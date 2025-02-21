import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

const iconMap = {
  "pasta e riso": require('../../images/spaghetti.png'),
  "carni": require('../../images/meat.png'),
  "pesce": require('../../images/fish.png'),
  "latte e uova": require('../../images/cheese.png'),
  "frutta e verdura": require("../../images/healthy-food.png"),
  "Preparazione": require("../../images/flour.png"),
  "legumi": require("../../images/legumes.png"),
  "dolci": require("../../images/cookie.png"),
  "bevande": require("../../images/plastic.png"),
  "condimenti": require("../../images/olive-oil.png"),
  "altro": require("../../images/surprise-box.png"),
};

const DiagonalBackground = ({ imageSize, spacing, opacity, categoria }) => {
  const { width, height } = Dimensions.get('window');
  const containerSize = { width: width * 2, height: height * 2 };

  const images = [];
  const numImagesX = Math.ceil(containerSize.width / (imageSize + spacing));
  const numImagesY = Math.ceil(containerSize.height / (imageSize + spacing));

  const source = iconMap[categoria];

  for (let i = 0; i < numImagesY; i++) {
    for (let j = 0; j < numImagesX; j++) {
      images.push(
        <Image
          key={`${i}-${j}`}
          source={source}
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize,
              left: j * (imageSize + spacing),
              top: i * (imageSize + spacing),
              opacity: opacity,
            },
          ]}
        />
      );
    }
  }

  return <View style={[styles.container, { width: containerSize.width, height: containerSize.height, pointerEvents: "none" }]}>{images}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    overflow: 'hidden',
    transform: [{ rotate: '-45deg' }],
    top: -Dimensions.get('window').height / 2,
    left: -Dimensions.get('window').width / 2,
  },
  image: {
    position: 'absolute',
  },
});

export default DiagonalBackground;
