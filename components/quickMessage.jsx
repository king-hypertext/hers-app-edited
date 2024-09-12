import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale, verticalScale, horizontalScale } from '@/lib/metrics'
import colors from '@/lib/colors'

export default function QuickMessage({ message, onpress }) {
    return (
        <TouchableOpacity style={styles.quickMessage} activeOpacity={.7} onPress={onpress}>
            <Text style={styles.message}>{message}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    quickMessage: {
        maxWidth: horizontalScale(130),
        height: verticalScale(120),
        marginHorizontal: moderateScale(10),
        marginVertical: moderateScale(20),
        backgroundColor: colors.white,
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        justifyContent: 'center',
        shadowColor: '#0006',
        shadowOffset: { height: 5, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 1,
        elevation: 7,
    },
    message: {
        fontWeight: '500',
        color: colors.black,
        fontSize: moderateScale(16),
        textAlign: 'center',
    }
})