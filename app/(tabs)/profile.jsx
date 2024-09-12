import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { unregisterIndieDevice } from 'native-notify'
import { router } from 'expo-router'
import io from 'socket.io-client'

import { moderateScale, horizontalScale, verticalScale } from '../../lib/metrics'
import { UserContext } from '../../lib/userContext'
import { api, saveInfo, supabase } from '../../lib/api'
import colors from '../../lib/colors'
import axios from 'axios'
import DropdownSelect from 'react-native-input-select'

const socket = io(api)

const Profile = () => {
    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        unregisterIndieDevice(user.email, 21783, '39A5A8wvtyioLgjcW0820z')
                        axios.delete(`https://app.nativenotify.com/api/app/indie/sub/21783/39A5A8wvtyioLgjcW0820z/${user.email}`)
                        socket.emit("is-offline", user.email)
                        await AsyncStorage.removeItem('user')
                        return router.replace('/login')
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const { user, setUser } = useContext(UserContext)


    const [name, setName] = useState(user.username)
    const [phonenumber, setPhoneNumber] = useState(user.phonenumber)
    const [gender, setGender] = useState(user.gender)
    const [isLoading, setIsLoading] = useState(false)
    const [residentialAddres, setResidentialAddress] = useState(user.residential_address);
    const [allergies, setAllergies] = useState(user.allergies);
    const [currentMedications, setCurrentMedications] = useState(user.current_medications);
    const [bloodGroup, setBloodGroup] = useState(user.blood_group);
    const [medicalConditions, setMedicalConditions] = useState(user.medical_conditions);
    const [email, setEmail] = useState(user.email);
    // const [] = useState()
    // const [] = useState(null);

    const savePersonalInfo = async () => {
        const payload = {
            residential_address: residentialAddres,
            allergies: allergies,
            current_medications: currentMedications,
            blood_group: bloodGroup,
            medical_conditions: medicalConditions,
            phone_number: phonenumber,
            email: email,
            fullname: name,
            gender: gender,
        };

        try {
            const data = await saveInfo(name, user.email, phonenumber, gender);
            if (data) {
                await AsyncStorage.setItem('user', JSON.stringify(data));
                const { data: userData, error } = await supabase
                    .from('users')
                    .upsert(payload, {
                        onConflict: 'email',
                        update: '*',
                    }).select('*');
                if (userData && userData.length > 0) {
                    await AsyncStorage.mergeItem('user', JSON.stringify(userData[0]));
                    setUser({ ...userData[0], ...data });
                    console.log('Upsert data:', userData);
                } else {
                    console.error('No data returned from upsert');
                }
                if (error) {
                    console.error('Error in upsert:', error);
                }
            }
        } catch (error) {
            console.error('Error', error);
        } finally {
            setIsLoading(false);
        }
    };


    console.log("user: ", user, "user: ", user);

    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <Text style={styles.headerText}>My Profile</Text>

                <TouchableOpacity style={styles.logout} activeOpacity={.7} onPress={() => handleLogout()}>
                    <Text style={{ color: colors.background, fontSize: moderateScale(14), fontWeight: '600' }}>Logout</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
                <TextInput
                    style={{ marginVertical: 10 }}
                    label='fullname'
                    mode='outlined'
                    value={name}
                    cursorColor={colors.main}
                    selectionColor={colors.hollowMain}
                    onChangeText={setName}
                />
                <TextInput
                    style={{ marginVertical: 10 }}
                    label='phone number'
                    mode='outlined'
                    value={phonenumber}
                    cursorColor={colors.main}
                    selectionColor={colors.hollowMain}
                    onChangeText={setPhoneNumber}
                />
                <TextInput
                    style={{ marginVertical: 10 }}
                    label='residential address'
                    // placeholder='Enter your residential address'
                    mode='outlined'
                    value={residentialAddres}
                    cursorColor={colors.main}
                    selectionColor={colors.hollowMain}
                    onChangeText={setResidentialAddress}
                />
                <TextInput
                    style={{ marginVertical: 10 }}
                    label='allergies'
                    mode='outlined'
                    value={allergies}
                    multiline={true}
                    numberOfLines={4}
                    cursorColor={colors.main}
                    selectionColor={colors.hollowMain}
                    onChangeText={setAllergies}
                />
                <TextInput
                    style={{ marginVertical: 10 }}
                    label='current medications'
                    mode='outlined'
                    value={currentMedications}
                    multiline={true}
                    numberOfLines={4}
                    cursorColor={colors.main}
                    selectionColor={colors.hollowMain}
                    onChangeText={setCurrentMedications}
                />
                <TextInput
                    style={{ marginVertical: 10 }}
                    label='medical conditions'
                    mode='outlined'
                    value={medicalConditions}
                    multiline={true}
                    numberOfLines={4}
                    cursorColor={colors.main}
                    selectionColor={colors.hollowMain}
                    onChangeText={setMedicalConditions}
                />
                <DropdownSelect
                    // label="Blood Group"
                    placeholder="Blood Group"
                    options={[
                        { label: 'A+', value: 'A+' },
                        { label: 'A-', value: 'A-' },
                        { label: 'B+', value: 'B+' },
                        { label: 'B-', value: 'B-' },
                        { label: 'AB+', value: 'AB+' },
                        { label: 'AB-', value: 'AB-' },
                    ]}

                    dropdownStyle={{
                        paddingVertical: verticalScale(1),
                        paddingHorizontal: horizontalScale(12),
                        borderWidth: 1.5,
                        height: 25,
                        borderColor: colors.grey,
                        borderRadius: moderateScale(5),
                        fontSize: moderateScale(16),
                        marginVertical: verticalScale(10),
                    }}
                    labelStyle={{ color: colors.black, fontSize: moderateScale(16), marginVertical: 0, paddingVertical: verticalScale(1) }}
                    placeholderStyle={{ fontSize: moderateScale(16), color: '#233' }}
                    selectedValue={bloodGroup}
                    onValueChange={setBloodGroup}
                    primaryColor={colors.main}
                />

                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity style={styles.selectGender} activeOpacity={.7} onPress={() => setGender('Male')}>
                    {gender === 'Male' ?
                        <Ionicons name='checkmark-circle' size={20} color={colors.main} /> :
                        <Entypo name='circle' size={20} color={colors.main} />
                    }
                    <Text style={{ fontSize: moderateScale(16), marginLeft: horizontalScale(5) }}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectGender} activeOpacity={.7} onPress={() => setGender('Female')}>
                    {gender === 'Female' ?
                        <Ionicons name='checkmark-circle' size={20} color={colors.main} /> :
                        <Entypo name='circle' size={20} color={colors.main} />
                    }
                    <Text style={{ fontSize: moderateScale(16), marginLeft: horizontalScale(5) }}>Female</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} activeOpacity={.7} onPress={() => savePersonalInfo()}>
                    {isLoading ?
                        <ActivityIndicator color={colors.background} size={'small'} /> :
                        <Text style={styles.saveBtnText}>Save</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.background
    },

    header: {
        width: '100%',
        height: verticalScale(70),
        backgroundColor: colors.background,
        paddingHorizontal: horizontalScale(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: moderateScale(26),
        fontWeight: '600',
        color: colors.black
    },
    logout: {
        backgroundColor: colors.main,
        paddingVertical: moderateScale(8),
        paddingHorizontal: horizontalScale(12),
        borderRadius: moderateScale(5),
    },
    scrollView: {
        flex: 1,
        paddingVertical: verticalScale(20),
        paddingTop: verticalScale(30),
        paddingHorizontal: horizontalScale(15),
        paddingBottom: verticalScale(50),
    },
    profilePicture: {
        width: moderateScale(120),
        height: moderateScale(120),
        borderRadius: moderateScale(300),
        alignSelf: 'center',
        marginBottom: verticalScale(40),
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
        fontWeight: '500',
    },
    textArea: {
        // height: 100,
        width: '100%',
        justifyContent: 'flex-start',
        textAlignVertical: 'top', // Ensures text starts at the top
        paddingVertical: verticalScale(12),
        textAlign: 'left',
        paddingHorizontal: horizontalScale(12),
        // borderWidth: 1.5,
        borderColor: colors.grey,
        // borderBottomColor: '#fff',
        borderRadius: moderateScale(12),
        fontSize: moderateScale(16),
        // fontWeight: '500',
        marginBottom: verticalScale(20),
        backgroundColor: colors.white
    },
    label: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        marginVertical: verticalScale(10)
    },
    selectGender: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10)
    },
    saveBtn: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(50),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(18),
        backgroundColor: colors.main,
        borderRadius: moderateScale(15),
    },
    saveBtnText: {
        color: colors.background,
        fontWeight: '600',
        fontSize: moderateScale(15)
    }
})