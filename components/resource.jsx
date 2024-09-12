import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { moderateScale, verticalScale } from '../lib/metrics'
import colors from '../lib/colors'
import { FontAwesome5 } from '@expo/vector-icons'

export default function Resource({ onpress, resourceType, iconName, title, author }) {

    return (
        <TouchableOpacity
            onPress={onpress}
            activeOpacity={.7}
            style={styles.resource}
        >
            <View style={[styles.icon, { backgroundColor: resourceType === 'edModule' ? colors.lightBlue : colors.lightRed }]}>
                <FontAwesome5 name={iconName} size={24} color={resourceType === 'edModule' ? colors.darkBlue : colors.main} />
            </View>
            <View style={styles.info}>
                <Text numberOfLines={2} style={styles.title}>{title}</Text>
                <Text style={styles.author}>Author: {author}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    resource: {

        width: '100%',
        height: verticalScale(50),
        marginVertical: verticalScale(10),
        flexDirection: 'row',
    },
    icon: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(10),
    },
    info: {
        width: '80%',
        justifyContent: 'center',
    },
    title: {
        width: '100%',
        fontSize: moderateScale(15),
        fontWeight: '500',
    },
    author: {
        fontWeight: '500',
        color: '#777777',
    }
})