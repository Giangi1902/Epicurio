import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from "@ui-kitten/components";
import { default as theme } from "./theme.json";
import * as SplashScreen from "expo-splash-screen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFonts } from "expo-font";
import { usePushNotifications } from './pages/main/usePushNotifications.js';
import { AppRegistry } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';

AppRegistry.registerComponent('main', () => App);

import Signup from './pages/authentication/signup.js';
import Login from './pages/authentication/login.js';
import Home from './pages/main/home.js';
import Menu from './pages/main/menu.js';
import Checklist from './pages/main/checklist.js';
import Profile from './pages/main/profile.js';
import Category from './pages/main/category.js';
import GeoLocation from './pages/main/geolocation.js';

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
      <TopTab.Screen name="Login" component={Login} />
      <TopTab.Screen name="Signup" component={Signup} />
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
        tabBarActiveTintColor: "#27241F",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "rgba(75, 114, 175, 0.35)",
          borderTopWidth: 0,
          borderRadius: 25,
          width: "85%",
          alignSelf: "center",
          position: "absolute",
          left: 30,
          height: 60,
          elevation: 0,
          shadowOpacity: 0,
          bottom: 10
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Menu"
        component={Menu}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Geolocation"
        component={GeoLocation}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Checklist"
        component={Checklist}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={30} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function App() {
  const [fontsloaded] = useFonts({
    'MyriadPro-Light': require('./assets/MyriadPro-Light.otf'),
    'MyriadPro-Regular': require('./assets/MyriadPro-Regular.otf'),
    'MyriadPro-Bold': require('./assets/MyriadPro-Bold.otf'),
    'MyriadPro-SemiBold': require('./assets/MyriadPro-SemiBold.otf'),
    'MyriadPro-Italic': require('./assets/MyriadPro-Italic.otf'),
  });

  useEffect(() => {
    if (!fontsloaded) {
      console.log("not loaded");
    } else {
      console.log("loaded");
      SplashScreen.hideAsync();
    }
  }, [fontsloaded]);

  usePushNotifications();

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight, backgroundColor: "#FFF7E8" }}>
        <StatusBar translucent={true} backgroundColor={'black'} barStyle={"dark-content"} />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Auth">
            <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ApplicationProvider>
  );
}

export default App;
