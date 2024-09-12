import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location'
import { LocationContext } from '../../lib/locationContext'
import { BookContext } from '../../lib/bookContext'
import { verticalScale } from "@/lib/metrics";
import colors from "@/lib/colors";

export default function RootLayout() {

  const [book, setBook] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null);

  return (
    <BookContext.Provider value={{ book, setBook }}>
      <Tabs
        sceneContainerStyle={{
          backgroundColor: '#efefef'
        }}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.main,
          headerShadowVisible: true,
          tabBarStyle: {
            height: verticalScale(70)
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "grid" : "grid-outline"} size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="maps"
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "map" : "map-outline"} size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="materials"
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "book" : "book-outline"} size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />,
          }}
        />
      </Tabs>
    </BookContext.Provider>
  );
}
