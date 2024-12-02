import { StyleSheet } from 'react-native';

// Funzione per la normalizzazione
export const normalize = (size) => {
    const scale = 375; // larghezza base dello schermo (ad esempio iPhone 11)
    const deviceWidth = Dimensions.get('window').width;
    return Math.round((size * deviceWidth) / scale);
};

// Stili globali
const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: normalize(14),
        color: '#333',
    },
    button: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: normalize(16),
    },
});

export default globalStyles;
