import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import colors from '../lib/colors'

const Index = () => {
    return (
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={colors.main} />
        </View>
    )
}

export default Index