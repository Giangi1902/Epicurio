import React, { useState } from "react";
import { ImageBackground, StyleSheet, View, Animated, Alert, TouchableOpacity, Text, Image, ActivityIndicator, StatusBar } from 'react-native'; // Importa Animated
import { Layout, Input } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as Notifications from 'expo-notifications';

const backgroundimg = require('../../images/food.png')

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation();

  const spinValue = useState(new Animated.Value(0))[0]; // Valore iniziale per l'animazione

  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://192.168.1.123:8080/login/${username}/${password}`);
      if (response.data.status === "ok") {
        await AsyncStorage.setItem("username", username)
        navigation.navigate("Main");
        setIsLoading(false)
      } else {
        Alert.alert("Username o password sbagliati");
        setIsLoading(false)
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false)
    }
  };


  const calculateTriggerTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const targetTime = new Date();
    targetTime.setHours(hours, minutes - 5, 0); // Set 5 minutes before the target time

    const now = new Date();
    const secondsUntilNotification = (targetTime - now) / 1000;
    return secondsUntilNotification > 0 ? secondsUntilNotification : 0;
  };

  async function schedulePushNotification(orarioPranzo, orarioCena) {
    if (orarioPranzo != null) {
      const secondsUntilLunchNotification = calculateTriggerTime(orarioPranzo);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Promemoria Pranzo!`,
          body: 'È quasi ora di pranzo! Inizia a cucinare',
        },
        trigger: { seconds: secondsUntilLunchNotification }
      });
    }
    if (orarioCena != null) {
      const secondsUntilDinnerNotification = calculateTriggerTime(orarioCena);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Promemoria Cena!",
          body: `È quasi ora di cena! Inizia a cucinare`,
        },
        trigger: { seconds: secondsUntilDinnerNotification }
      });
    }
  }

  const startSpin = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    ).start();
  };

  return (
    <Layout style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'#ADC8AD'} barStyle={"dark-content"} />
      <ImageBackground source={backgroundimg} style={styles.backgroundImage} resizeMode='repeat'>

        <View style={styles.imageContainer}>
          <View style={styles.backgroundWrapper} />
          <Image source={require('../../images/image.png')} style={styles.image} />
        </View>

        <Input placeholder="Inserisci username" style={styles.input} textStyle={{ color: "black", fontFamily: "Poppins_400Regular" }} onChangeText={(text) => setUsername(text)} autoCapitalize="none" />
        <Input placeholder="Inserisci password" style={styles.input} textStyle={{ color: "black", fontFamily: "Poppins_400Regular" }} onChangeText={(text) => setPassword(text)} secureTextEntry={true} autoCapitalize="none" />
        
        {isLoading === false ?
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => { setIsLoading(!isLoading); startSpin(); handleLogin() }} style={styles.button}>
              <Text style={{ alignSelf: "center", fontFamily: "Poppins_400Regular", color: "white" }}>Login</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={[styles.buttonContainer, styles.loadingContainer]}>
            <View style={styles.loadingBackground}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          </View>
        }

      </ImageBackground>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'black',
    borderWidth: 2,
    marginVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 15,
  },
  backgroundImage: {
    flex: 1,
  },
  button: {
    backgroundColor: "#9B0800",
    borderRadius: 15,
    padding: 15
  },
  buttonContainer: {
    paddingHorizontal: 100,
    marginVertical: 10
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    position: 'relative'
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ADC8AD',
    opacity: 0.75,
    borderRadius: 50,
    borderWidth: 1
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default Login;
