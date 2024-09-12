import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Animated, Linking, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from 'expo-image'

import { verticalScale, moderateScale } from '@/lib/metrics'
import { LocationContext } from "../../../lib/locationContext";
import QuickMessage from "../../../components/quickMessage";
import { Greeting } from "../../../components/greeting";
import { UserContext } from '../../../lib/userContext'
import colors from '@/lib/colors'

import profilePicture from '@/assets/images/icon.png'
import axios from "axios";
import { errorToast, successToast, warnToast } from "../../../lib/toasts";
import { insertData, supabase } from "../../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const quickMessages = [
  {
    message: 'I have an accident 🤕',
  }, {
    message: 'I have an injury 🩼',
  }, {
    message: 'I feel pain 🫠',
  }, {
    message: 'I feel nauseous 🤢'
  }, {
    message: "I'm hungry 🥲"
  }, {
    message: "Someone's having a heart attack 💔"
  }, {
    message: '➕ \n Send a new message'
  }
]

const keyExtractor = (item, index) => index;

export default function Index() {

  const { user } = useContext(UserContext);
  const { location } = useContext(LocationContext)

  const outermostAnim = useRef(new Animated.Value(0)).current;
  const outerAnim = useRef(new Animated.Value(0)).current;
  const innerAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(outermostAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(outermostAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.timing(outerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(outerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.timing(innerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(innerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  const outermostInterpolated = outermostAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0, 0.2],
  });

  const outerInterpolated = outerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0, 0.35],
  });

  const innerInterpolated = innerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0, 0.4],
  });

  const sendRequestToAdmin = async () => {
    startAnimation();

    const users = {
      fullname: user.username,
      phone_number: user.phonenumber,
      gender: user.gender,
      residential_address: user.residential_addres,
      allergies: user.allergies,
      current_medications: user.current_medications,
      blood_group: user.blood_group,
      medical_conditions: user.medical_condition,
      email: user.email,
    }
    const emergencies = {
      longitude: location.longitude,
      latitude: location.latitude,
      description: 'no message',
    }
    console.log("user: ", user, "emergencies: ", emergencies);
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert(users, {
          onConflict: 'phone_number',
        }).select();

      if (emergencies !== null) {
        emergencies.user_id = data[0].id;
        await supabase
          .from('emergencies')
          .insert([emergencies]);
      }
      if (error) {
        console.log(error);
        setTimeout(() => {
          errorToast('Failed to send request. Please check your internet connection and try again');
        }, 1900);
        // throw error;
      } else {
        console.log(data);
        successToast('Request sent successfully');
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        errorToast('Failed to send request. Please check your internet connection and try again');
      }, 1900);
    }
  }
  const makeCall = () => {
    startAnimation();

    // setTimeout(() => Linking.openURL('tel:+233 24 058 8084'), 1900);
  };

  // const phoneNumber = '+233 24 058 8084'
  // const userLocation = `My location is: \nLONGITUDE: ${location.longitude}\nLATITUDE: ${location.latitude}`
  // const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}\n\n${userLocation}\n\nSent from the HERS App`
  // const urlEmpty = `sms:${phoneNumber}?body=${encodeURIComponent('Write your message...')}\n\n${userLocation}\n\nSent from the HERS App`
  const sendMessage = async (message) => {
    let users = {
      fullname: user.username,
      phone_number: user.phonenumber,
      gender: user.gender,
      residential_address: user.residential_addres,
      allergies: user.allergies,
      current_medications: user.current_medications,
      blood_group: user.blood_group,
      medical_conditions: user.medical_condition,
      email: user.email,
    }
    let emergencies = {
      longitude: location.longitude,
      latitude: location.latitude,
      description: message,
    }
    console.log("user: ", user, "emergencies: ", emergencies);
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert(users, {
          onConflict: 'phone_number',
        }).select();

      if (emergencies !== null) {
        emergencies.user_id = data[0].id;
        await supabase
          .from('emergencies')
          .insert([emergencies]);
      }
      if (error) {
        console.log(error);
        setTimeout(() => {
          errorToast('Failed to send request. Please check your internet connection and try again');
        }, 1900);
        // throw error;
      } else {
        console.log(data);
        successToast('Request sent successfully');
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        errorToast('Failed to send request. Please check your internet connection and try again');
      }, 1900);
    }
    console.log(user, location);
  }

  return (
    <View
      style={styles.main}
    >
      <View style={styles.header}>
        <View>
          <Greeting />
          <Text style={styles.username}>{user.username}</Text>
        </View>
        <View>
          <Image
            source={profilePicture}
            style={styles.profilePicture}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cta01}>
          <Text style={{
            width: '100%',
            fontSize: moderateScale(36),
            textAlign: 'center',
            fontWeight: '500',
          }}>Emergency Help{`\n`}Needed?</Text>
          <Text style={{
            width: '100%',
            fontSize: moderateScale(14),
            textAlign: 'center',
          }}>Tap the button below; help will reach you soon.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Animated.View style={[styles.outterMostButton, { opacity: outermostInterpolated }]} />
          <Animated.View style={[styles.outterButton, { opacity: outerInterpolated }]} />
          <Animated.View style={[styles.innerButton, { opacity: innerInterpolated }]} />
          <TouchableOpacity style={styles.SOSbutton} activeOpacity={.7} onPress={sendRequestToAdmin}>
            <MaterialIcons name="emergency-share" color={'#fff'} size={moderateScale(64)} />
            <Text style={{ color: '#fff' }}>
              Quick Request
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.miniTitle}>Send a Quick Message</Text>
        <Text style={styles.description}>
          Tap one of the options below, customize it, then send.
        </Text>

        {/* <Text>{location}</Text> */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={quickMessages}
          keyExtractor={keyExtractor}
          renderItem={({ item, index }) => <QuickMessage key={index} message={item.message} onpress={() => sendMessage(item.message)} />}
          horizontal={true}
          style={styles.quickMessagesSection}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: verticalScale(15)
  },
  header: {
    width: '100%',
    height: verticalScale(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(30),
  },
  username: {
    fontSize: moderateScale(26),
    fontWeight: '700',
  },
  profilePicture: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: 100,
  },
  buttonContainer: {
    width: '100%',
    height: moderateScale(220),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: verticalScale(50),
    marginBottom: verticalScale(50)
  },
  outterMostButton: {
    width: moderateScale(220),
    height: moderateScale(220),
    backgroundColor: colors.main,
    borderRadius: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  outterButton: {
    width: moderateScale(190),
    height: moderateScale(190),
    backgroundColor: colors.main,
    borderRadius: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  innerButton: {
    width: moderateScale(160),
    height: moderateScale(160),
    backgroundColor: colors.main,
    borderRadius: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  SOSbutton: {
    width: moderateScale(130),
    height: moderateScale(130),
    backgroundColor: colors.main,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  miniTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  description: {
    fontSize: moderateScale(14),
    color: '#777777'
  },
  quickMessagesSection: {
    width: '100%',
    marginTop: verticalScale(20),
  }
})