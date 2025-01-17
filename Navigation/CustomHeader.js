import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const CustomHeader = ({ title }) => {
    return (
        <View style={styles.header}>
            <Image
                source={require('../assets/logo.png')} // Replace with your image path
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.text}>BARANGAY APPLICATION</Text>
            <Text style={styles.text1}>BARANGAY III, DAET, CAMARINES NORTE</Text>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#710808',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    image: {
        width: width * 0.5, // Use percentage of screen width for responsiveness
        height: undefined,  // Allow height to scale based on width
        aspectRatio: 1,     // Maintain aspect ratio of the image
        marginBottom: 10,   // Adjust the spacing as needed
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10, // Adjust margin to add spacing between text and image
        textAlign: 'center', // Center align the text
    },
    text1: {
        color: 'white',
        fontSize: 14, // Slightly smaller font for subtitle
        marginTop: 5, // Adjust margin for spacing
        textAlign: 'center', // Center align the text
    },
});

export default CustomHeader;
