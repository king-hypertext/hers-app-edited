import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location'
import { errorToast } from '../lib/toasts';
import { router } from 'expo-router';
import { horizontalScale, moderateScale, verticalScale } from '../lib/metrics';
import { LocationContext } from '../lib/locationContext';
import colors from '../lib/colors';

import LocationPin from '@/assets/images/location.png'

const LocationScreen = () => {

    const { setLocation } = useContext(LocationContext)

    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return errorToast('Permission to access location was denied');
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location)
        return router.replace('/')
    }

    return (
        <View style={styles.main}>
            <Image
                alt='a map pin icon'
                source={LocationPin}
                style={styles.icon}
            />
            <Text style={styles.text}>Location</Text>
            <Text style={styles.description}>A feature in this app requires your permission to access your location.</Text>
            <TouchableOpacity activeOpacity={.7} onPress={requestLocationPermission} style={styles.button}>
                <Text style={{ color: '#ffffff', fontWeight: '600' }}>Grant Permission</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: horizontalScale(15)
    },
    icon: {
        width: moderateScale(120),
        height: moderateScale(120),
        objectFit: 'contain'
    },
    text: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: verticalScale(10),
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },
    button: {
        backgroundColor: colors.main,
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(12),
    }
})

export default LocationScreen;
