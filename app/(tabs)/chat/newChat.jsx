import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { UserContext } from '../../../lib/userContext'
import colors from '../../../lib/colors'
import { horizontalScale, moderateScale, verticalScale } from '../../../lib/metrics'
import { router } from 'expo-router'
import { ContactOnly } from '../../../components/contact'
import { loadUsers } from '../../../lib/api'

import pp from '@/assets/images/icon.png'

const NewChat = () => {

    const { user } = useContext(UserContext)

    const [isLoading, setIsLoading] = useState()
    const [users, setUsers] = useState([])

    // const profilePicture = 

    useEffect(() => {
        const getUsers = async () => {
            setIsLoading(true)
            await loadUsers()
                .then(data => {
                    if (data) {
                        setUsers(data)
                        return setIsLoading(false)
                    }
                })
        }

        getUsers()
    }, [])

    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={.7} onPress={() => router.back()}>
                    <Ionicons name='arrow-back' color={colors.black} size={24} style={{ marginRight: horizontalScale(20) }} />
                </TouchableOpacity>
                <Text style={styles.headerText}>New Chat</Text>
            </View>
            <ScrollView>
                <Text
                    style={{
                        paddingHorizontal: horizontalScale(15),
                        fontSize: moderateScale(14),
                        marginTop: verticalScale(20),
                        marginBottom: verticalScale(30)
                    }}>
                    Start a conversation with health professionals
                </Text>
                {isLoading ?
                    <ActivityIndicator color={colors.main} size={'large'} style={{ alignSelf: 'center' }} /> :
                    (users.map((dbuser, index) => {
                        return (<ContactOnly
                            key={index}
                            name={user.username === dbuser.username ? 'You' : dbuser.username}
                            designation={dbuser.designation}
                            pp={pp}
                            onpress={() => router.navigate({ pathname: `/chat/${user.username === dbuser.username ? 'You' : dbuser.username}`, params: { recipientEmail: dbuser.email, designation: dbuser.designation } })}
                        />)
                    }
                    ))
                }
            </ScrollView>
        </View>
    )
}

export default NewChat

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        width: '100%',
        height: verticalScale(70),
        alignItems: 'center',
        paddingHorizontal: horizontalScale(15),
        flexDirection: 'row',
    },
    headerText: {
        fontSize: moderateScale(26),
        fontWeight: '600'
    }
})