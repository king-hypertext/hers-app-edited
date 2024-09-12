import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { moderateScale } from '@/lib/metrics'

export const Greeting = () => {

    const [greeting, setGreeting] = useState('');

    const morningStartTime = new Date();
    morningStartTime.setHours(0, 0, 0);
    const morningEndTime = new Date();
    morningEndTime.setHours(12, 0, 0);

    const afternoonStartTime = new Date();
    afternoonStartTime.setHours(12, 0, 0);
    const afternoonEndTime = new Date();
    afternoonEndTime.setHours(17, 0, 0);

    const eveningStartTime = new Date();
    eveningStartTime.setHours(17, 0, 0);
    const eveningEndTime = new Date();
    eveningEndTime.setHours(0, 0, 0);

    const currentTime = new Date();

    useEffect(() => {
        if (currentTime >= morningStartTime && currentTime < morningEndTime) {
            setGreeting('Good Morning 👋');
        } else if (currentTime >= afternoonStartTime && currentTime < afternoonEndTime) {
            setGreeting('Good Afternoon 👋');
        } else if (currentTime >= eveningStartTime && currentTime > eveningEndTime) {
            setGreeting('Good Evening 👋');
        }
    }, [])

    return (
        <Text
            style={{
                fontSize: moderateScale(12),
            }}
        >{greeting}
        </Text>
    );
}