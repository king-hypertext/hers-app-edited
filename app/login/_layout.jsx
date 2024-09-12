import { Stack } from "expo-router";

const StackRouter = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default StackRouter
