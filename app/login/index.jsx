import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { registerIndieID } from 'native-notify'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Image } from 'expo-image'

import { verticalScale, horizontalScale, moderateScale } from '../../lib/metrics'
import { login, supabase } from '../../lib/api'
import { UserContext, UserDataContext } from '../../lib/userContext'
import colors from '../../lib/colors'

import logo from '@/assets/images/logo.png'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {

    const { setUser } = useContext(UserContext)
    // const { setUserData } = useContext(UserDataContext);


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [hidePassword, setHidePassword] = useState(true)
    const [isLoading, setIsLoading] = useState(false)


    const handleLogin = async () => {
        setIsLoading(true)
        await login(email, password)
            .then(async (data) => {
                if (data) {
                    try {
                        await registerIndieID(email, 21783, '39A5A8wvtyioLgjcW0820z');
                        await AsyncStorage.setItem('user', JSON.stringify(data));
                        // setUser(data);
                        const { data: userData, error } = await supabase
                            .from('users')
                            .select('*')
                            .eq('email', email);

                        if (userData && userData.length > 0) {
                            await AsyncStorage.mergeItem('user', JSON.stringify(userData[0]));
                            setUser({ ...userData[0], ...data });
                            console.log('Select data:', userData);
                        } else {
                            console.error('No data returned from select');
                        }

                        if (error) {
                            console.error('Error in select: ', error);
                        }
                    } catch (error) {
                        console.error('Error saving async user: ', error);
                    } finally {
                        router.replace('/home');
                        setIsLoading(false);
                    }
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                setIsLoading(false);
            });

    }

    return (
        <View style={styles.main}>
            <Image
                source={logo}
                contentFit='contain'
                style={styles.logo}
            />
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.description}>
                Enter your email and password to start using the HERS app.
            </Text>

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

            <TouchableOpacity activeOpacity={.7} style={styles.showPassword} onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons
                    name={!hidePassword ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={moderateScale(20)}
                    color={hidePassword ? '#777' : colors.main}
                    style={{ marginRight: verticalScale(5) }}
                />
                <Text style={{ fontSize: moderateScale(14) }}>Show Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} activeOpacity={.7} onPress={() => handleLogin()}>
                {isLoading ?
                    <ActivityIndicator color={colors.background} size={'small'} /> :
                    <Text style={styles.buttonText}>Login</Text>
                }
            </TouchableOpacity>

            <Text style={{ marginBottom: verticalScale(20), textAlign: 'center' }}>OR</Text>

            <TouchableOpacity activeOpacity={.7} style={styles.cbutton} onPress={() => router.navigate('/login/signup')}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

        </View>
    )
}

export default Login

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
    }
})