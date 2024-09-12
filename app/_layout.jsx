import React, { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FlashMessage from 'react-native-flash-message'
import * as SplashScreen from 'expo-splash-screen'
import * as Location from 'expo-location'
import registerNNPushToken, { registerIndieID } from 'native-notify'
import { Stack, router } from 'expo-router'
import io from 'socket.io-client'
import { UserContext } from '@/lib/userContext'
import { verticalScale } from '../lib/metrics'
import { api } from '../lib/api'
import { LocationContext } from '../lib/locationContext'

SplashScreen.preventAutoHideAsync()
const socket = io(api)

const StackLayout = () => {

    registerNNPushToken(21783, '39A5A8wvtyioLgjcW0820z');
    const [user, setUser] = useState()
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const handleAppStateChange = () => {
            if (AppState.currentState === 'background' && user) {
                return socket.emit('is-offline', user.email)
            }
        }

        const subscription = AppState.addEventListener('change', handleAppStateChange)

        return () => { subscription.remove() }
    }, [])


    useEffect(() => {

    }, []);

    // loadUser
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user')
                if (storedUser) {
                    const userdata = JSON.parse(storedUser)
                    setUser(userdata)
                    registerIndieID(userdata.email, 21783, '39A5A8wvtyioLgjcW0820z')
                    socket.emit('is-online', userdata.email)
                } else {
                    setUser(null)
                }
            } catch (e) {
                console.log('Error fetching user', e)
            }
        }
        loadUser()
    }, [])

    // on user context change
    useEffect(() => {
        (async () => {
            if (!location) {
                let { status } = await Location.getForegroundPermissionsAsync();
                if (status !== 'granted') {
                    SplashScreen.hideAsync()
                    return router.replace('/location')
                    // setErrorMsg('Permission to access location was denied');
                } else {
                    let location = await Location.getCurrentPositionAsync({});
                    setLocation(location.coords);
                }
            }
            if (user) {
                AsyncStorage.setItem('user', JSON.stringify(user))
                registerIndieID(user.email, 21783, '39A5A8wvtyioLgjcW0820z')
                router.replace('/home')
                SplashScreen.hideAsync()
            } else {
                AsyncStorage.removeItem('user')
                router.replace('/login')
                SplashScreen.hideAsync()
            }
        })();
    }, [user, location])

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            <UserContext.Provider value={{ user, setUser }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        statusBarStyle: 'dark',
                        statusBarColor: '#eee'
                    }}
                >
                    <Stack.Screen name='location' />
                    <Stack.Screen name='(tabs)' />
                    <Stack.Screen name='login' />
                </Stack>
                <FlashMessage position='top' statusBarHeight={verticalScale(20)} floating={true} />
            </UserContext.Provider>
        </LocationContext.Provider>
    )
}

export default StackLayout
