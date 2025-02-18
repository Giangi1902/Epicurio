import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, View, StatusBar, AppRegistry, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from "@ui-kitten/components";
import { default as theme } from "./theme.json";
import * as SplashScreen from "expo-splash-screen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
import { usePushNotifications } from './pages/main/usePushNotifications.js';
import { normalize } from './pages/main/home.js';
import { useTheme } from "./themeContext";
import { greenTheme, blueTheme, redTheme, purpleTheme } from "./theme";

AppRegistry.registerComponent('main', () => App);

import Signup from './pages/authentication/signup.js';
import Login from './pages/authentication/login.js';
import Home from './pages/main/home.js';
import Menu from './pages/main/pantry.js';
import Checklist from './pages/main/checklist.js';
import Profile from './pages/main/profile.js';
import Category from './pages/main/category.js';
import GeoLocation from './pages/main/geolocation.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Diet from './pages/main/diet.js';
import Calendario from './pages/main/calendar.js'
import BottomTogglePage from './pages/components/bottomToggle.js';
import TinderSwipe from './pages/main/fooder.js';
import { ThemeProvider, ThemeContext } from "./themeContext.js";
import MealPage from './pages/main/mealPage.js';

const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const MenuStack = createStackNavigator()
SplashScreen.preventAutoHideAsync();

// Mappa dei temi disponibili
const themes = {
  green: greenTheme,
  purple: purpleTheme,
  blue: blueTheme,
  red: redTheme,
};

function AuthStack({ navigation }) {
  useEffect(() => {
    const checkUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (username !== null) {
          // If the username is present, navigate to the main screen
          navigation.navigate('Main');
        }
      } catch (error) {
        console.error('Error retrieving username from AsyncStorage:', error);
      }
    };

    checkUsername();
  }, []);

  return (
    <TopTab.Navigator
      initialRouteName={"Signup"}
      screenOptions={{
        tabBarStyle: { backgroundColor: "#9B0800" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#27241F",
        tabBarIndicatorStyle: { backgroundColor: "white" },
        tabBarLabelStyle: {
          fontFamily: "Poppins_400Regular"
        }
      }}>
      <TopTab.Screen name="Signup" component={Signup} style={{ fontFamily: "Poppins_400Regular" }} />
      <TopTab.Screen name="Login" component={Login} />
    </TopTab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
    </HomeStack.Navigator>
  );
}

function MenuStackScreen() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuScreen" component={Menu} />
      <MenuStack.Screen name="Category" component={Category} />
      <MenuStack.Screen name="MealPage" component={MealPage}/>
    </MenuStack.Navigator>
  );
}

function MainTabs() {

  const [appTheme, setAppTheme] = useState(null); // Stato per il tema

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");
        if (savedTheme) {
          setAppTheme(themes[savedTheme]); // Converte stringa in oggetto tema
        } else {
          setAppTheme(greenTheme); // Imposta il tema di default
        }
      } catch (error) {
        console.error("Errore nel caricamento del tema:", error);
      }
    };
    loadTheme();
  }, []);

  if (!appTheme) return null;

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: appTheme.coloreScuro,
        tabBarInactiveTintColor: "#f7f7f7",
        tabBarStyle: {
          backgroundColor: appTheme.coloreChiaro,
          borderTopWidth: 0,
          borderTopRightRadius: 45,
          borderTopLeftRadius: 45,
          height: 60
        },
        animation: "shift",
        tabBarIconStyle: {
          marginTop: 5
        },
        tabBarLabelStyle: {
          fontSize: normalize(10),
          fontFamily: "Poppins_300Light",
        }
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={25} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Menu"
        component={MenuStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Dispensa",
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant" color={color} size={25} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Finder"
        component={TinderSwipe}
        options={{
          headerShown: false,
          tabBarLabel: "Finder",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" color={color} size={25} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Checklist"
        component={Checklist}
        options={{
          headerShown: false,
          tabBarLabel: "Carrello",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" color={color} size={25} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: "Profilo",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={25} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function App() {
  const [fontsloaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  useEffect(() => {
    if (!fontsloaded) {
    } else {
      SplashScreen.hideAsync();
    }
  }, [fontsloaded]);

  // usePushNotifications();
  const [appTheme, setAppTheme] = useState(null); // Stato per il tema

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");
        if (savedTheme) {
          setAppTheme(themes[savedTheme]); // Converte stringa in oggetto tema
        } else {
          setAppTheme(greenTheme); // Imposta il tema di default
        }
      } catch (error) {
        console.error("Errore nel caricamento del tema:", error);
      }
    };
    loadTheme();
  }, []);

  if (!appTheme) return null; // Evita il rendering fino a quando il tema non è caricato

  return (
    <ThemeProvider>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <SafeAreaProvider>
          <SafeAreaView style={[styles.AndroidSafeArea, { backgroundColor: appTheme.coloreChiaro }]}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Auth">
                <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </ApplicationProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

export default App;

