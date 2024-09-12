import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const StackRouter = () => {
    return (
        <>
            <StatusBar style="dark" backgroundColor="#eee" />
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: 'Chat Screen',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="newChat"
                    options={{
                        headerShown: false,
                        animation: 'fade_from_bottom'
                    }}
                />
            </Stack>
        </>
    )
}

export default StackRouter
