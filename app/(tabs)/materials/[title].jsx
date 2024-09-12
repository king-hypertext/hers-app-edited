import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { horizontalScale, verticalScale, moderateScale } from '../../../lib/metrics'
import colors from '../../../lib/colors'
import { edModules } from '../../../lib/edModules'
import { firstaid } from '../../../lib/firstaid'

export default function BookDetails() {

    const { title, content, author, type } = useLocalSearchParams()

    const goBack = () => {
        router.back()
    }

    return (
        <View style={styles.main}>
            <View style={styles.headerContainer}>
                <Ionicons name='arrow-back' color={colors.black} style={styles.icon} onPress={goBack} />
            </View>
            <ScrollView>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
                <Text style={styles.author}>Author: {author}</Text>
                <View style={styles.content}>
                    <Text style={styles.contentText}>{content}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.background
    },
    headerContainer: {
        width: '100%',
        height: verticalScale(70),
        justifyContent: 'center',
        paddingHorizontal: horizontalScale(15),
        backgroundColor: colors.background,
        zIndex: 3,
    },
    icon: {
        fontSize: moderateScale(24),
    },
    title: {
        width: '100%',
        marginBottom: verticalScale(10),
        paddingHorizontal: horizontalScale(15),
    },
    titleText: {
        fontSize: moderateScale(24),
        fontWeight: '500',
    },
    author: {
        width: '100%',
        marginBottom: verticalScale(30),
        paddingHorizontal: horizontalScale(15),
        fontWeight: '500',
        color: '#777777'
    },
    content: {
        width: '100%',
        paddingHorizontal: horizontalScale(15),
    },
    contentText: {
        width: '100%',
        fontSize: moderateScale(16),
        color: colors.black,
        lineHeight: moderateScale(22)
    }
})