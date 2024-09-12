import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image'
import { horizontalScale, moderateScale, verticalScale } from '@/lib/metrics'
import colors from '@/lib/colors'

import pp00 from '@/assets/profilePictures/icon.png'
import { router } from 'expo-router';

const Contact = ({ onpress, pp, name, lastMessage, messageCount }) => {
    return (
        <TouchableOpacity activeOpacity={.7} style={styles.contactContainer} onPress={onpress}>
            <Image
                source={pp ? pp : pp00}
                style={styles.pp}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.profileName}>{name}</Text>
                <Text numberOfLines={1} style={styles.lastMessage}>{lastMessage}</Text>
            </View>
            <View style={styles.messageCount}>
                {messageCount ?
                    <View style={styles.count}>
                        <Text style={{ fontWeight: '600', color: colors.background, fontSize: moderateScale(12) }}>{messageCount}</Text>
                    </View> : ''
                }
            </View>
        </TouchableOpacity>
    );
}

export const ContactOnly = ({ onpress, pp, name, designation }) => {
    return (
        <TouchableOpacity activeOpacity={.7} style={styles.contactContainer} onPress={onpress}>
            <Image
                source={pp}
                style={styles.pp}
                contentFit='contain'
            />
            <View style={styles.infoContainer}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileNameMini}>{designation}</Text>
            </View>
        </TouchableOpacity>
    );
}

export const Group = ({ pp, groupname, lastmessage, messageCount }) => {
    return (
        <TouchableOpacity activeOpacity={.7} style={styles.contactContainer}>
            <Image
                source={pp ? pp : pp00}
                style={styles.pp}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.profileName}>{groupname}</Text>
                <Text numberOfLines={1} style={styles.lastMessage}>{lastmessage}</Text>
            </View>
            <View style={styles.messageCount}>
                {messageCount ?
                    <View style={styles.count}>
                        <Text style={{ fontWeight: '600', color: colors.background, fontSize: moderateScale(12) }}>{messageCount}</Text>
                    </View> : ''
                }
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    contactContainer: {
        width: '100%',
        height: verticalScale(50),
        marginBottom: verticalScale(20),
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(15),
    },
    pp: {
        width: moderateScale(50),
        height: moderateScale(50),
        marginRight: moderateScale(15),
        borderRadius: moderateScale(200)
    },
    infoContainer: {
        width: '72%',
        justifyContent: 'space-evenly',
    },
    profileName: {
        fontSize: moderateScale(18),
        fontWeight: '700',
    },
    profileNameMini: {
        fontSize: moderateScale(14),
        fontWeight: '500',
    },
    lastMessage: {
        fontSize: moderateScale(14),
        color: '#555555'
    },
    messageCount: {
        width: '10%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    count: {
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(50),
        backgroundColor: colors.main,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500'
    }
})

export default Contact;
