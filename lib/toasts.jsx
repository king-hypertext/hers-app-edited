import { showMessage } from "react-native-flash-message";
import colors from "./colors";

export const successToast = (message, duration = 500) => {
    showMessage({
        message: message,
        duration: duration,
        backgroundColor: colors.success
    })
    return
}

export const warnToast = (message, duration) => {
    showMessage({
        message: message,
        duration: duration,
        backgroundColor: colors.warn,
        icon: 'info'
    })
    return
}

export const errorToast = (message, duration) => {
    showMessage({
        message: message,
        duration: duration,
        backgroundColor: colors.main
    })
    return
}