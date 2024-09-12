import React, { useState } from 'react'
import { Animated, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'

import { horizontalScale, moderateScale, verticalScale } from '../lib/metrics'
import colors from '../lib/colors'

import CoverImage from '@/assets/images/illustrations/mat_sapiens.png'

const Max_Header_Height = verticalScale(350);
const Min_Header_Height = verticalScale(50);
const Scroll_Distance = Max_Header_Height - Min_Header_Height

export default function DynamicHeader({ animHeaderValue, onFilterSelect }) {

    const animatedHeaderHeight = animHeaderValue.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [Max_Header_Height, Min_Header_Height],
        extrapolate: 'clamp'
    })

    const [filter, setFilter] = useState('All')

    return (
        <Animated.View
            style={[
                styles.dynamicHeader,
                { height: animatedHeaderHeight, }
            ]}
        >
            <Image
                alt='an illustration of a dude reading something on his phone'
                cachePolicy={'memory-disk'}
                contentFit='contain'
                contentPosition={'top'}
                source={CoverImage}
                style={styles.coverImage}
            />
            <Image />
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    activeOpacity={.4}
                    style={[styles.filter, { backgroundColor: filter === 'All' ? colors.grey : '#0000' }]}
                    onPress={() => { setFilter('All'), onFilterSelect('All') }}
                >
                    <Text style={{ fontWeight: '600' }}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={.4}
                    style={[styles.filter, { backgroundColor: filter === 'edModules' ? colors.grey : '#0000' }]}
                    onPress={() => { setFilter('edModules'), onFilterSelect('edModules') }}
                >
                    <Text style={{ fontWeight: '600' }}>Educational Modules</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={.4}
                    style={[styles.filter, { backgroundColor: filter === 'firstaid' ? colors.grey : '#0000' }]}
                    onPress={() => { setFilter('firstaid'), onFilterSelect('firstaid') }}
                >
                    <Text style={{ fontWeight: '600' }}>First Aid Guides</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    dynamicHeader: {
        justifyContent: 'flex-end'
    },
    coverImage: {
        marginHorizontal: horizontalScale(15),
        height: verticalScale(300),
    },
    filterContainer: {
        width: '100%',
        paddingHorizontal: horizontalScale(20),
        paddingBottom: verticalScale(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filter: {
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(9),
        borderRadius: moderateScale(100),
    }
})
