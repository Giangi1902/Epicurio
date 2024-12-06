import React, { useEffect } from 'react';
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

AppRegistry.registerComponent('main', () => App);

import Signup from './pages/authentication/signup.js';
import Login from './pages/authentication/login.js';
import Home from './pages/main/home.js';
import Menu from './pages/main/menu.js';
import Checklist from './pages/main/checklist.js';
import Profile from './pages/main/profile.js';
import Category from './pages/main/category.js';
import GeoLocation from './pages/main/geolocation.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Diet from './pages/main/diet.js';

const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

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
        tabBarIndicatorStyle: { backgroundColor: "white" }
      }}>      
      <TopTab.Screen name="Signup" component={Signup} />
      <TopTab.Screen name="Login" component={Login} />
    </TopTab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="Category" component={Category} />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#0B7308",
        tabBarInactiveTintColor: "#f7f7f7",
        tabBarStyle: {
          backgroundColor: "#ADC8AD",
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
        component={Menu}
        options={{
          headerShown: false,
          tabBarLabel: "Dispensa",
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant" color={color} size={25} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Diet"
        component={Diet}
        options={{
          headerShown: false,
          tabBarLabel: "Diete",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" color={color} size={25} />
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

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.AndroidSafeArea}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Auth">
              <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
              <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({ 
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "#ADC8AD",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

export default App;

