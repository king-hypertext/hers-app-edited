import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import colors from '../../../lib/colors'
import { horizontalScale, moderateScale, verticalScale } from '../../../lib/metrics'
import Title from '../../../components/titles'
import Contact, { Group } from '../../../components/contact'
import { io } from 'socket.io-client'

import pp01 from '@/assets/profilePictures/icon.png'
import { api, loadRecentChats } from '../../../lib/api'
import { UserContext } from '../../../lib/userContext'

const socket = io(api)

export default function Chat() {

    const { user } = useContext(UserContext)
    const [chats, setChats] = useState([])

    useFocusEffect(
        useCallback(() => {
            const fetchChats = async () => {
                await loadRecentChats(user.email)
                    .then((response) => {
                        const data = response.data
                        setChats(data.chats)
                    })
                    .catch(error => console.log('error loading chats:', error))
            }

            fetchChats()
        }, []))

    return (
        <View style={styles.main}>
            <Title
                title={'Messages'}
            />
            <ScrollView style={styles.messagesContainer}>
                {/* <View style={{ borderBottomWidth: 1, borderBottomColor: '#cccccc', paddingBottom: verticalScale(5), marginBottom: verticalScale(25) }}>
                    <Group
                        groupname={'Community'}
                        lastmessage={'Oboy: Things are running amock here'}
                        messageCount={3}
                    />
                </View> */}
                {
                    chats ? (chats.map((chat, index) => {
                        const displayName = user.username === chat.receivername ? chat.sendername : chat.receivername
                        const receipientEmail = user.email === chat.receiver ? chat.sender : chat.receiver
                        return (
                            <Contact
                                key={index}
                                pp={pp01}
                                name={displayName}
                                lastMessage={chat.message}
                                onpress={() => router.navigate({ pathname: `/chat/${displayName}`, params: { recipientEmail: receipientEmail } })}
                            />
                        )
                    })
                    ) : <Text style={{ alignSelf: 'center' }}>You have no conversation</Text>
                }
            </ScrollView>
            <TouchableOpacity style={styles.addBtn} onPress={() => router.navigate('/chat/newChat')}>
                <Ionicons name='add' color={colors.background} size={28} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.background,
    },
    messagesContainer: {
        flex: 1,
        paddingTop: verticalScale(15),
    },
    addBtn: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(200),
        bottom: verticalScale(15),
        right: horizontalScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10,
        elevation: 5,
        shadowColor: '#3333',
        backgroundColor: colors.main,
    }
})
