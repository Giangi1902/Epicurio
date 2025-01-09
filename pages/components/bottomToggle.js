import React, { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const BottomTogglePage = () => {
    // hooks
    const sheetRef = useRef(null);

    // variables
    const data = useMemo(
        () =>
            Array(50)
                .fill(0)
                .map((_, index) => `index-${index}`),
        []
    );
    const snapPoints = useMemo(() => ["5%", "50%", "90%"], []);

    // callbacks
    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
    }, []);

    // render
    const renderItem = useCallback(
        ({ item }) => (
            <View style={styles.itemContainer}>
                <Text>{item}</Text>
            </View>
        ),
        []
    );
    return (
        <GestureHandlerRootView style={styles.container}>
            <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
            <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
            <Button title="Snap To 5%" onPress={() => handleSnapPress(0)} />
            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
            >
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(i) => i}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contentContainer}
                />
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
    },
    contentContainer: {
        backgroundColor: "white",
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#fee",
    },
});

export default BottomTogglePage;