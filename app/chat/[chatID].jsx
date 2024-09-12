import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import io from 'socket.io-client'

import { horizontalScale, moderateScale, verticalScale } from '../../lib/metrics'
import { api, sendNotification, loadMessages, sendMessage } from '../../lib/api'
import { Recipient, Sender } from '../../components/messages'
import { UserContext } from '../../lib/userContext'
import colors from '../../lib/colors'

import pp00 from '@/assets/profilePictures/icon.png'
import chatBG from '@/assets/images/chatBG.png'

const socket = io(api)

const ChatScreen = () => {

    const { user } = useContext(UserContext)
    const { chatID, recipientEmail, designation } = useLocalSearchParams()

    const [initialMessages, setInitialMessages] = useState([])
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessages] = useState('')

    const roomID = [user.email, recipientEmail].sort().join('-')

    useEffect(() => {
        const fetchMessages = async () => {
            await loadMessages(roomID)
                .then((response) => {
                    const data = response.data
                    setInitialMessages(data.messages)
                })
                .catch(error => console.log('ERROR LOADING MESSAGES:', error))
        }
        fetchMessages()
    }, [roomID])

    useEffect(() => {
        socket.emit('join-private-room', user.email, roomID)

        socket.on('receive-message', (data) => {
            return setMessages((prevMessages) => [...prevMessages, data])
        })

        return () => {
            socket.emit('leave-room', user.email, roomID)
        }
    }, [])

    const getTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const handlSendMessage = async () => {
        const data = {
            room: roomID,
            sender: user.email,
            receiver: recipientEmail,
            message: inputMessage,
            time: getTime()
        }
        await sendMessage(data.room, data.sender, user.username, data.receiver, chatID, data.message, data.time)
            .then((data) => console.log(data.data))
        sendNotification(recipientEmail, user.username, inputMessage)
        setInputMessages('')
        return
    }

    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={.7} onPress={() => { router.navigate({ pathname: '/chat' }), setMessages('') }}>
                    <Ionicons name='arrow-back' color={colors.black} size={24} style={{ marginRight: horizontalScale(15) }} />
                </TouchableOpacity>
                <Image
                    source={pp00}
                    style={styles.pp}
                />
                <View>
                    <Text style={styles.headerText}>{chatID}</Text>
                    <Text style={styles.headerTextMini}>{designation}</Text>
                </View>
            </View>
            <ImageBackground source={chatBG} style={styles.chatArea}>
                <ScrollView style={styles.messages} showsVerticalScrollIndicator={false}>
                    {initialMessages.map((message, index) => {
                        return (message.sender === user.email ?
                            <Sender
                                key={index}
                                message={message.message}
                                time={message.time}
                            /> :
                            <Recipient
                                key={index}
                                message={message.message}
                                time={message.time}
                            />)
                    })}
                    {messages.map((message, index) => {
                        return (message.sender === user.email ?
                            <Sender
                                key={index}
                                message={message.message}
                                time={message.time}
                            /> :
                            <Recipient
                                key={index}
                                message={message.message}
                                time={message.time}
                            />)
                    })}
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput
                        value={inputMessage}
                        onChangeText={setInputMessages}
                        style={styles.textInput}
                        multiline={true}
                        textAlignVertical='center'
                        placeholder='Type a message'
                        cursorColor={colors.main}
                        selectionColor={colors.hollowMain}
                    />

                    <TouchableOpacity style={styles.send} activeOpacity={.7} onPress={() => handlSendMessage()}>
                        <Ionicons name='send-sharp' size={24} color={colors.background} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

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
    pp: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(200),
        marginRight: horizontalScale(10)
    },
    headerText: {
        fontSize: moderateScale(20),
        fontWeight: '600'
    },
    headerTextMini: {
        fontSize: moderateScale(14),
        fontWeight: '500'
    },
    chatArea: {
        flex: 1,
        paddingHorizontal: horizontalScale(15),
        paddingBottom: verticalScale(10),
    },
    messages: {
        flex: 1,
        paddingVertical: verticalScale(10),
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textInput: {
        width: '85%',
        maxHeight: verticalScale(120),
        marginRight: horizontalScale(10),
        borderRadius: moderateScale(15),
        backgroundColor: '#ffffff',
        paddingHorizontal: horizontalScale(15),
        paddingVertical: verticalScale(10),
        fontSize: moderateScale(15),
        color: colors.black,
        lineHeight: moderateScale(15)
    },
    send: {
        width: moderateScale(40),
        height: moderateScale(40),
        backgroundColor: colors.main,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(120),
    }
})

export default ChatScreen