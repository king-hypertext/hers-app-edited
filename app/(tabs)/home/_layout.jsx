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
        </Stack>
    )
}

export default StackRouter
