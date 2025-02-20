import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, View, Alert, TouchableOpacity, Image, ActivityIndicator, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Layout, Text, Input } from '@ui-kitten/components';
import { usePushNotifications } from '../main/usePushNotifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const backgroundimg = require('../../images/food.png');

export default function Signup() {
  const [orariopranzo, setOrarioPranzo] = useState(new Date());
  const [orariocena, setOrarioCena] = useState(new Date());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation();
  const [showPranzoPicker, setShowPranzoPicker] = useState(false);
  const [showCenaPicker, setShowCenaPicker] = useState(false);
  const { expoPushToken, notification } = useState("")
  // usePushNotifications()


  const handleCreate = async () => {
    if (username && password && orariopranzo && orariocena) {
      try {
        const orariocenaFormatted = orariocena.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        const orariopranzoFormatted = orariopranzo.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        const response = await axios.post("http://192.168.1.89:8080/signup", {
          username, password, expoPushToken, orariopranzo: orariopranzoFormatted, orariocena: orariocenaFormatted
        })
        if (response.data == "ok") {
          await AsyncStorage.setItem("username", username)
          setUsername("")
          setPassword("")
          navigation.navigate('Main');
          setIsLoading(false)
        }
        else if (response.data == "esiste") {
          Alert.alert("Username già esistente")
          setIsLoading(false)
        }
      }
      catch (e) {
        console.log(e)
        setIsLoading(false)
      }
    }
    else {
      Alert.alert("Tutti i campi sono obbligatori, inserisci tutte le informazioni!")
      setIsLoading(false)
    }
  }
  const handleOrarioPranzoChange = (event, selectedDate) => {
    setShowPranzoPicker(false);
    if (selectedDate) {
      setOrarioPranzo(selectedDate);
    }
  };

  const handleOrarioCenaChange = (event, selectedDate) => {
    setShowCenaPicker(false);
    if (selectedDate) {
      setOrarioCena(selectedDate);
    }
  };

  const handlePranzoPicker = () => {
    setShowPranzoPicker(true);
  };

  const handleCenaPicker = () => {
    setShowCenaPicker(true);
  };

  return (
    <Layout style={styles.container}>
      <ImageBackground source={backgroundimg} style={styles.backgroundImage} resizeMode='repeat'>

        <View style={styles.imageContainer}>
          <View style={styles.backgroundWrapper} />
          <Image source={require('../../images/image.png')} style={styles.image} />
        </View>

        <ScrollView style={{ flex: 1 }}>

          <Input placeholder='Inserisci username' style={styles.input} textStyle={{ color: "black", fontFamily: "Poppins_400Regular" }} onChangeText={(text) => setUsername(text)} autoCapitalize="none" />
          <Input placeholder='Inserisci password' style={styles.input} textStyle={{ color: "black", fontFamily: "Poppins_400Regular" }} onChangeText={(text) => setPassword(text)} secureTextEntry={true} autoCapitalize="none" />

          {Platform.OS === 'ios' ?
            <View style={styles.buttonContainerOrario}>
              <View style={styles.buttonOrario}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTextStyle}>Orario del pranzo: </Text>
                  <DateTimePicker value={orariopranzo} mode="time" is24Hour={true} display="default" onChange={handleOrarioPranzoChange} />
                </View>
              </View>
            </View>
            :
            <View style={styles.buttonContainerOrario}>
              <TouchableOpacity style={styles.buttonOrario} onPress={handlePranzoPicker}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTextStyle}>Orario del pranzo:</Text>
                  <Text style={styles.dateTimePickerAndroid}>{orariopranzo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              </TouchableOpacity>
              {showPranzoPicker && (<DateTimePicker value={orariopranzo} mode="time" is24Hour={true} display="default" onChange={handleOrarioPranzoChange} />)}
            </View>
          }

          {Platform.OS === 'ios' ?
            <View style={styles.buttonContainerOrario}>
              <View style={styles.buttonOrario}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTextStyle}>Orario della cena:</Text>
                  <DateTimePicker value={orariocena} mode="time" is24Hour={true} display="default" onChange={handleOrarioCenaChange} />
                </View>
              </View>
            </View>
            :
            <View style={styles.buttonContainerOrario}>
              <TouchableOpacity style={styles.buttonOrario} onPress={handleCenaPicker}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTextStyle}>Orario della cena: </Text>
                  <Text style={styles.dateTimePickerAndroid}>{orariocena.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              </TouchableOpacity>
              {showCenaPicker && (<DateTimePicker value={orariocena} mode="time" is24Hour={true} display="default" onChange={handleOrarioCenaChange} />)}
            </View>
          }


        </ScrollView>

        {isLoading === false ?
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => { handleCreate() }} style={styles.button}>
              <Text style={styles.textButton}>Signup</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={[styles.buttonContainer, styles.loadingContainer]}>
            <View style={styles.blackBackground}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          </View>
        }

        <StatusBar style="auto" />
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
  textButton: {
    alignSelf: "center",
    fontFamily: "Poppins_400Regular"
  },
  buttonOrario: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
  },
  buttonContainer: {
    paddingHorizontal: 100,
    marginVertical: 10
  },
  buttonContainerOrario: {
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    width: '90%',
    marginVertical: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  blackBackground: {
    backgroundColor: '#9B0800',
    borderRadius: 15,
    padding: 10
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  inputTextStyle: {
    color: "black",
    fontFamily: "Poppins_400Regular"
  },
  dateTimePickerAndroid: {
    color: "black",
    fontFamily: "Poppins_400Regular",
    backgroundColor: "#d1d1d1",
    paddingTop: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10
  }
});
