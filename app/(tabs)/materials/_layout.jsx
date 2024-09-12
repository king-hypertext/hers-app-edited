import { Stack } from "expo-router";

const StackRouter = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Material Screen',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="[title]"
                options={{
                    headerTitle: 'Book',
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default StackRouter
