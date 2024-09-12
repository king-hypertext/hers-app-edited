import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { verticalScale, moderateScale, horizontalScale } from '../lib/metrics'
import colors from '../lib/colors'

export default function Title({ title }) {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: '100%',
        height: verticalScale(70),
        justifyContent: 'center',
        paddingHorizontal: horizontalScale(15),
        backgroundColor: colors.background,
        zIndex: 3,
    },
    title: {
        fontSize: moderateScale(26),
        fontWeight: "600",
    },
})
