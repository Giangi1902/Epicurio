import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const YOUR_GOOGLE_MAPS_API_KEY = ''; 
const DEFAULT_LOCATION = {
    latitude: 40.45921982384192,
    longitude: 17.251302724043203,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
};

export default function GeoLocation() {
    const [region, setRegion] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Location permission denied, using default location');
                    setRegion(DEFAULT_LOCATION);
                    fetchSupermarkets(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
                    return;
                }
                getCurrentLocation();
            } catch (err) {
                console.warn(err);
                setRegion(DEFAULT_LOCATION);
                fetchSupermarkets(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
            }
        };

        const getCurrentLocation = async () => {
            try {
                let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const { latitude, longitude } = coords;
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025
                });
                fetchSupermarkets(latitude, longitude);
            } catch (error) {
                Alert.alert('Error', 'Failed to get location. Using default location.');
                console.error(error);
                setRegion(DEFAULT_LOCATION);
                fetchSupermarkets(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
            }
        };

        const fetchSupermarkets = async (latitude, longitude) => {
            const radius = 750;
            const type = 'supermarket';
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${YOUR_GOOGLE_MAPS_API_KEY}`;

            try {
                const response = await axios.get(url);
                const data = response.data;
                if (data.results) {
                    const supermarketMarkers = data.results.map(place => ({
                        id: place.id,
                        name: place.name,
                        coordinate: {
                            latitude: place.geometry.location.lat,
                            longitude: place.geometry.location.lng,
                        },
                    }));
                    setMarkers(supermarketMarkers);
                }
            } catch (error) {
                console.error('Error fetching supermarkets:', error);
                Alert.alert('Error', 'Failed to fetch supermarkets. Please try again later.');
            }
        };

        requestLocationPermission();
    }, []);

    return (
        <View style={styles.container}>
            {region && (
                <MapView style={styles.map} region={region} showsUserLocation>
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker.coordinate}
                            title={marker.name}
                        />
                    ))}
                </MapView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
