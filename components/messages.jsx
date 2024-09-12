import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import colors from '../lib/colors'
import { moderateScale, verticalScale } from '../lib/metrics'

export const Recipient = ({ message, time }) => {
    return (
        <View style={styles.sender}>
            <Text style={styles.sMessage}>{message}</Text>
            <Text style={styles.time}>{time}</Text>
        </View>
    )
}

export const Sender = ({ message, time }) => {
    return (
        <View style={styles.recipient}>
            <Text style={styles.rMessage}>{message}</Text>
            <View style={styles.stime}>
                <Text style={styles.stime}>{time}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sender: {
        alignSelf: 'flex-start',
        minWidth: 'auto',
        maxWidth: '80%',
        height: 'auto',
        borderTopRightRadius: moderateScale(12),
        borderBottomRightRadius: moderateScale(12),
        borderBottomLeftRadius: moderateScale(12),
        backgroundColor: '#ffffff',
        padding: moderateScale(10),
        marginBottom: verticalScale(15),
    },
    recipient: {
        alignSelf: 'flex-end',
        minWidth: 'auto',
        maxWidth: '80%',
        height: 'auto',
        borderTopLeftRadius: moderateScale(12),
        borderBottomRightRadius: moderateScale(12),
        borderBottomLeftRadius: moderateScale(12),
        backgroundColor: colors.main,
        padding: moderateScale(10),
        marginBottom: verticalScale(15),
    },
    sMessage: {
        color: '#000000',
        marginBottom: verticalScale(2),
        fontSize: moderateScale(14),
    },
    rMessage: {
        color: '#ffffff',
        marginBottom: verticalScale(2),
        fontSize: moderateScale(14),
    },
    time: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: '#999',
        textAlign: 'right'
    },
    stime: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: '#fffd',
        textAlign: 'right',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
})