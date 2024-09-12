import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { verticalScale, horizontalScale, moderateScale } from '../../lib/metrics'
import colors from '../../lib/colors'
import logo from '@/assets/images/logo.png'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { signup, supabase } from '../../lib/api'

const Signup = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phonenumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hidePassword, setHidePassword] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const handleSignUp = async () => {
        let payload = {
            fullname: name,
            phone_number: phonenumber,
            email: email,
        }
        setIsLoading(true)
        await signup(name, email, phonenumber, password, confirmPassword)
            .then(() => setIsLoading(false));
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([payload]).select();
            if (data && data.length > 0) {
                console.log("upsert data: ", data);

            } else {
                console.error('No data returned from upsert', error);
            }
            if (error) {
                console.error('Error in insert:', error);
            }
        } catch (e) {
            // save error
            console.log(e);
        }
    }

    return (
        <ScrollView style={styles.main}>
            <Image
                source={logo}
                contentFit='contain'
                style={styles.logo}
            />
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.description}>
                Provide some personal information to create an account you'd
                be using to access the HERS app.
            </Text>

            <TextInput
                keyboardType='default'
                textContentType='name'
                placeholder='First and Last Name'
                cursorColor={colors.main}
                selectionColor={colors.hollowMain}
                style={styles.textInput}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                keyboardType='email-address'
                textContentType='emailAddress'
                placeholder='Email'
                cursorColor={colors.main}
                selectionColor={colors.hollowMain}
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                keyboardType='number-pad'
                textContentType='telephoneNumber'
                placeholder='Phone Number'
                cursorColor={colors.main}
                selectionColor={colors.hollowMain}
                style={styles.textInput}
                value={phonenumber}
                onChangeText={setPhoneNumber}
            />
            <TextInput
                keyboardType='default'
                textContentType='password'
                placeholder='Password'
                secureTextEntry={hidePassword}
                cursorColor={colors.main}
                selectionColor={colors.hollowMain}
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                keyboardType='default'
                textContentType='password'
                placeholder='Confirm Password'
                secureTextEntry={hidePassword}
                cursorColor={colors.main}
                selectionColor={colors.hollowMain}
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity activeOpacity={.7} style={styles.showPassword} onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons
                    name={!hidePassword ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={moderateScale(20)}
                    color={hidePassword ? '#777' : colors.main}
                    style={{ marginRight: verticalScale(5) }}
                />
                <Text style={{ fontSize: moderateScale(14) }}>Show Password</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={.7} style={styles.button} onPress={() => handleSignUp()}>
                {isLoading ?
                    <ActivityIndicator color={colors.background} size={'small'} /> :
                    <Text style={styles.buttonText}>Create an Account</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.already} onPress={() => router.back()}>
                <Text style={{ fontSize: moderateScale(15), fontWeight: '600' }}>Already have an account? <Text style={{ color: colors.main }}>Login</Text></Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default Signup

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: horizontalScale(15),
        paddingTop: verticalScale(20),
    },
    logo: {
        width: moderateScale(50),
        height: moderateScale(50),
        marginBottom: verticalScale(30),
    },
    title: {
        fontSize: moderateScale(34),
        fontWeight: '700',
        marginBottom: verticalScale(10),
    },
    description: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: '#888',
        marginBottom: verticalScale(30),
    },
    textInput: {
        width: '100%',
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(12),
        borderWidth: 1.5,
        borderColor: colors.grey,
        borderRadius: moderateScale(12),
        fontSize: moderateScale(16),
        marginBottom: verticalScale(20),
        fontWeight: '400',
    },
    showPassword: {
        width: '100%',
        marginBottom: verticalScale(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: colors.main,
        height: verticalScale(55),
        borderRadius: moderateScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20)
    },
    cbutton: {
        width: '100%',
        backgroundColor: colors.black,
        height: verticalScale(55),
        borderRadius: moderateScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20)
    },
    buttonText: {
        fontSize: moderateScale(15),
        color: colors.background,
        fontWeight: '600',
        letterSpacing: 1,
    },
    already: {
        alignItems: 'center'
    }
})