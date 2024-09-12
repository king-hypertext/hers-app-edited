import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { horizontalScale, moderateScale, verticalScale } from '../../lib/metrics'
import { LocationContext } from "../../lib/locationContext";
import { getNearbyHealthFacilities } from '../../lib/places'

import clinic from '@/assets/images/icons/clinic.png'
import hospital from '@/assets/images/icons/hospital.png'
import pharmacy from '@/assets/images/icons/pharmacy.png'
import profilePic from '@/assets/images/icon.png'

export default function Maps() {

    const { location } = useContext(LocationContext)

    const [nearbyFacilities, setNearbyFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState([])

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            await getNearbyHealthFacilities(location.longitude, location.latitude)
                .then(result => {
                    setNearbyFacilities(result)
                    setIsLoading(false)
                })
        })();
    }, [location])

    return (
        <>
            {!nearbyFacilities && isLoading ?
                <View style={[styles.main, { justifyContent: 'center' }]}>
                    <ActivityIndicator size={'large'} color={colors.main} />
                </View> : <View style={styles.main}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0122,
                            longitudeDelta: 0.0121,
                        }}
                        provider={PROVIDER_GOOGLE}
                    >
                        {nearbyFacilities.map((facility, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: facility.properties.lat,
                                    longitude: facility.properties.lon
                                }}
                                title={facility.properties.name}
                                calloutAnchor={{ x: 0.5, y: 0.0 }}
                                image={facility.properties.datasource.raw.amenity === 'hospital' ?
                                    hospital : facility.properties.datasource.raw.amenity === 'pharmacy' ?
                                        pharmacy : clinic
                                }
                            />
                        ))}

                        <Marker
                            key={'pka'}
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            title="You"
                        >
                            <View style={styles.meContainer}>
                                <Image source={profilePic} style={styles.me} />
                            </View>
                        </Marker>
                    </MapView>
                    <View style={styles.legendsContainer}>
                        <View style={styles.legends}>
                            <View style={styles.legend}>
                                <Image
                                    source={clinic}
                                    style={styles.legendIcon}
                                />
                                <Text style={styles.legendText}>Clinic</Text>
                            </View>
                            <View style={styles.legend}>
                                <Image
                                    source={hospital}
                                    style={styles.legendIcon}
                                />
                                <Text style={styles.legendText}>Hospital</Text>
                            </View>
                            <View style={styles.legend}>
                                <Image
                                    source={pharmacy}
                                    style={styles.legendIcon}
                                />
                                <Text style={styles.legendText}>Pharmacy</Text>
                            </View>
                        </View>
                    </View>
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#aaaaaa',
    },
    map: {
        flex: 1,
    },
    meContainer: {
        position: 'relative',
        overflow: 'hidden',
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: 300,
    },
    me: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(200),
        position: 'absolute'
    },
    legendsContainer: {
        width: '100%',
        height: verticalScale(50),
        position: 'absolute',
        top: verticalScale(10),
        paddingHorizontal: horizontalScale(15),
    },
    legends: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(10),
        elevation: 7,
        shadowColor: '#0007',
        padding: moderateScale(15),
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    legend: {
        width: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
    },
    legegndIcon: {
        width: moderateScale(24),
        height: moderateScale(24),
        marginRight: horizontalScale(5),
    },
    legendText: {
        fontWeight: '500'
    }

})
