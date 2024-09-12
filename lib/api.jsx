import { router } from 'expo-router'
import { errorToast, warnToast, successToast } from './toasts'
import io from 'socket.io-client'
import axios from 'axios'
// import validator from 'validator'
import * as SQLite from 'expo-sqlite'

export const api = 'https://wecithelpdesk.tech:3117'
const socket = io(api)
const db = SQLite.openDatabaseSync('messages')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ntzgefxxgebesrjssotn.supabase.co";
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50emdlZnh4Z2ViZXNyanNzb3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NTc1MjIsImV4cCI6MjA0MTUzMzUyMn0.4d_Exnb5NpgpUBs1x80IkUX4M91wb6uAYBflU0OeX6A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    localStorage: AsyncStorage,
});
// export const insertData = async (table, data) => {
//     const { data, error } = await supabase
//         .from(table)
//         .upsert([data]).select('id').then(async (data) => {
//             await supabase
//                 .from('emergencies')
//                 .insert([{ user_id: data[0].id, emergency_name: 'Fire' }]);
//         });
//     if (error) {
//         return error;
//     } else {
//         return { success: true }
//     }
// };
export const insertData = async (users, emergencies) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .upsert([users], {
                onConflict: 'phone_number', // Assuming phone_number is the unique key
                update: '*', // Update all columns
                returning: 'id',
            }).select('id');

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
            throw error;
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
};


export const signup = async (name, email, phonenumber, password, confirmPassword) => {
    if (!name || !email || !phonenumber || !password || !confirmPassword) {
        return warnToast("Fields can't be empty.")
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return warnToast("Please enter a valid email")
    }
    if (password !== confirmPassword) {
        return warnToast("Passwords don't match.")
    }
    try {

        const submit = await fetch(`${api}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phonenumber: phonenumber,
                password: password
            })
        })
        const result = await submit.json()

        if (result.error) {
            return errorToast(result.error)
        }

        successToast("Account created successfully")
        return router.back()

    } catch (e) {
        console.log('error signin up', e)
        return errorToast('An error occured. Please try again later')
    }
}

// export const login = async (email, password) => {
//     if (!email || !password) {
//         return warnToast("Fields can't be empty.")
//     }
//     try {
//         const submit = await fetch(`${api}/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email: email,
//                 password: password
//             })
//         })
//         const result = await submit.json()

//         if (result.error) {
//             return errorToast(result.error)
//         }

//         socket.emit("is-online", email)
//         const data = result.user
//         return data

//     } catch (e) {
//         console.log('error signin up', e)
//         return errorToast('An error occured. Please try again later')
//     }
// }
export const login = async (email, password) => {
    if (!email || !password) {
        return warnToast("Fields can't be empty.")
    }

    try {
        const response = await fetch(`${api}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const result = await response.json()

        if (result.error) {
            return errorToast(result.error)
        }

        socket.emit("is-online", email)
        return result.user
    } catch (error) {
        console.error('Login error:', error)
        return errorToast('An error occurred. Please try again later')
    }
}

export const saveInfo = async (name, email, phonenumber, gender) => {
    if (!name || !email || !phonenumber) {
        return warnToast("Fields can't be empty.")
    }
    try {
        const submit = await fetch(`${api}/savePersonalInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                // firstname: firstname,
                // lastname: lastname,
                phonenumber: phonenumber,
                email: email,
                gender: gender
            })
        })
        const result = await submit.json()

        if (result.error) {
            return errorToast(result.error)
        }

        const data = result.userInfo
        successToast("Personal info updated successfully")
        return data

    } catch (e) {
        console.log('error saving info', e)
        return errorToast('An error occured. Please try again later')
    }
}

export const loadUsers = async () => {
    try {
        const fetchUsers = await fetch(`${api}/fetchUsers`)
        const response = await fetchUsers.json()

        if (response.error) {
            console.log(response.error)
            return ("An error occured. Please try again later")
        }

        const data = response.onlineUsers
        return data

    } catch (e) {
        errorToast('An error occured. Please try again later')
        console.log('error loading users', e)
    }
}

export const sendNotification = (email, title, message) => {
    axios.post('https://app.nativenotify.com/api/indie/notification', {
        subID: email,
        appId: 21783,
        appToken: '39A5A8wvtyioLgjcW0820z',
        title: title,
        message: message
    })
}

export const loadRecentChats = async (email) => {
    const chats = await axios(`${api}/fetch-recent-chats/${email}`)
    return chats
}

export const loadMessages = async (roomID) => {
    const messages = await axios(`${api}/fetch-messages/${roomID}`)
    return messages
}

export const sendMessage = async (roomID, sender, sendername, receiver, receivername, message, time) => {
    if (!message) {
        return
    }
    const data = {
        room: roomID,
        sender: sender,
        message: message,
        time: time
    }
    socket.emit('send-message', data)

    const result = await axios.post(`${api}/save-message`, {
        roomID: roomID,
        sender: sender,
        sendername: sendername,
        receiver: receiver,
        receivername: receivername,
        message: message,
        time: time
    })
    return result
}

export const getBooks = async () => {
    const data = await axios(`${api}/fetch-books`)
    return data
}

export const getEdBooks = async () => {
    const data = await axios(`${api}/fetch-books-ed`)
    return data
}

export const getFirstBooks = async () => {
    const data = await axios(`${api}/fetch-books-first`)
    return data
}