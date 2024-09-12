import express from "express";
import dotenv from 'dotenv'
import mysql from 'mysql2'
import bcrypt from 'bcryptjs'
import { Server } from 'socket.io'
import cors from 'cors'
import * as https from 'https'
import * as fs from 'fs'

dotenv.config()
const app = express()
app.use(express.json(), cors())
const server = https.createServer(app)
const io = new Server(server, {
    cors: {
        // origin: "http://192.168.100.136:5173"
    }
})

const serverOptions = {
    key: fs.readFileSync('../../../../../etc/letsencrypt/live/wecithelpdesk.tech/privkey.pem'),
    cert: fs.readFileSync('../../../../../etc/letsencrypt/live/wecithelpdesk.tech/fullchain.pem')
}

const httpsServer = https.createServer(serverOptions, app)

const conn = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

// let uploadedFileName

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../profiles/');
//     },
//     filename: (req, file, cb) => {
//         const fileName = Math.floor(Math.random() * 9000000000) + 1000000000;
//         cb(null, fileName + path.extname(file.originalname))
//         uploadedFileName = fileName + path.extname(file.originalname)
//     }
// })

// const upload = multer({ storage: storage })

function getTime() {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const year = today.getFullYear()
    const todayDate = `${day} ${months[month]} ${year}`
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\//g, '');
    const hour = today.getHours()
    const minute = today.getMinutes()
    const amOrPm = hour >= 12 ? 'PM' : 'AM'
    const time = `${hour}:${minute} ${amOrPm}`

    return { todayDate, formattedDate, time }
}

const queryError = 'An error occured. Please try again later'

// -----------------------------------------------------------------

io.on('connection', (socket) => {
    socket.on('is-online', (email) => {
        console.log(email, 'is online')
    })

    socket.on('join-private-room', (email, roomID) => {
        socket.join(roomID)
        console.log(`${email} joined room: ${roomID}`);
    })

    socket.on('send-message', (data) => {
        socket.to(data.room).emit("receive-message", data)
    })

    socket.on('leave_room', (email, roomId) => {
        socket.leave(roomId);
        console.log(`${email} left room: ${roomId}`);
    });

    socket.on('is-offline', (email) => {
        socket.disconnect(true)
        const query = 'UPDATE users SET isonline = 0 WHERE email = ?'
        conn.query(query, email, (err, info) => {
            if (err) {
                console.log('error executing query', err)
            }
            console.log(email, `disconnected`)
        })
    })
})

// -----------------------------------------------------------------

// test api
app.get('/test', (req, res) => {
    console.log('This test worked')
    return res.json(getTime().todayDate)
})

// -----------------------------------------------------------------

app.post('/login-admin', (req, res) => {
    const { email, password } = req.body
    const query = 'SELECT * FROM admins WHERE email = ?'

    conn.query(query, email, (error, result) => {

        if (error) {
            console.log('error executing query', error)
            return res.json({ error: queryError })
        }

        if (result.length === 0) {
            return res.json({ error: 'User does not exist' })
        }

        const dbPassword = result[0].password
        const decrypt = bcrypt.compareSync(password, dbPassword)
        if (!decrypt) {
            return res.json({ error: 'Email or password incorrect' })
        }

        const user = result[0]
        res.json({ user })
    })
})

app.post('/login', (req, res) => {
    const { email, password } = req.body
    const query = 'SELECT * FROM users WHERE email = ?'

    conn.query(query, email, (error, result) => {

        if (error) {
            console.log('error executing query', error)
            return res.json({ error: queryError })
        }

        if (result.length === 0) {
            return res.json({ error: 'User does not exist' })
        }

        const dbPassword = result[0].password
        const decrypt = bcrypt.compareSync(password, dbPassword)
        if (!decrypt) {
            return res.json({ error: 'Email or password incorrect' })
        }

        const user = result[0]
        res.json({ user })
    })
})

app.post('/signup-admin', (req, res) => {
    const { name, email, phonenumber, designation, password } = req.body
    const adminQuery = 'INSERT INTO admins (username, phonenumber, email, designation, password) VALUES (?, ?, ?, ?, ?)'

    const hashedPassword = bcrypt.hashSync(password, 13)

    conn.query(adminQuery, [name, phonenumber, email, designation, hashedPassword], (err, info) => {
        if (err) {
            console.log('error execuing query', err)
            return res.json({ error: queryError })
        } if (info.affectedRows === 0) {
            console.log("Error adding new user")
            return res.json({ error: "Can't create account now. Please try again later" })
        }
        return res.json("Success")
    })
})

app.post('/signup', (req, res) => {
    const { name, email, phonenumber, password } = req.body
    const query = 'INSERT INTO users (username, phonenumber, email, password) VALUES (?,?,?,?)'
    const adminQuery = 'INSERT INTO users (username, phonenumber, email, designation, password) VALUES (?, ?, ?, ?, ?)'

    const hashedPassword = bcrypt.hashSync(password, 13)

    conn.query(query, [name, phonenumber, email, hashedPassword], (err, info) => {
        if (err) {
            console.log('error execuing query', err)
            return res.json({ error: queryError })
        } if (info.affectedRows === 0) {
            console.log("Error adding new user")
            return res.json({ error: "Can't create account now. Please try again later" })
        }
        return res.json("Success")
    })
})

app.post('/savePersonalInfo-admin', (req, res) => {
    const { name, email, phonenumber } = req.body
    const query = 'UPDATE admins SET username = ?, phonenumber = ? WHERE email = ?'
    const fetchQuery = 'SELECT * FROM admins WHERE email = ?'

    conn.query(query, [name, phonenumber, email], (err, result) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        }
        if (result.affectedRows === 0) {
            return res.json({ error: "Can't update personal info now. Please try again later" })
        }
        conn.query(fetchQuery, email, (error, info) => {
            if (error) {
                console.log('error executing query', error)
                return res.json({ error: queryError })
            }

            const userInfo = info[0]
            return res.status(201).json({ userInfo })
        })
    })
})

app.post('/savePersonalInfo', (req, res) => {
    const { name, email, phonenumber, gender } = req.body
    const query = 'UPDATE users SET username = ?, phonenumber = ?, gender = ? WHERE email = ?'
    const fetchQuery = 'SELECT * FROM users WHERE email = ?'

    conn.query(query, [name, phonenumber, gender, email], (err, result) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        }
        if (result.affectedRows === 0) {
            return res.json({ error: "Can't update personal info now. Please try again later" })
        }
        conn.query(fetchQuery, email, (error, info) => {
            if (error) {
                console.log('error executing query', error)
                return res.json({ error: queryError })
            }

            const userInfo = info[0]
            return res.status(201).json({ userInfo })
        })
    })
})

app.get('/fetchUsers', (req, res) => {
    const query = 'SELECT * FROM admins'
    conn.query(query, (err, info) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        }
        const onlineUsers = info
        return res.json({ onlineUsers })
    })
})

app.post('/save-message', (req, res) => {
    const { roomID, sender, sendername, receiver, receivername, message, time } = req.body
    const query = 'INSERT INTO messages (roomID, sender, sendername, receiver, receiverName, message, time) VALUES (?, ?, ?, ?, ? ,?, ?)'

    conn.query(query, [roomID, sender, sendername, receiver, receivername, message, time], (err, info) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        } else if (info.affectedRows === 0) {
            return res.json({ error: 'Cant send message now. Please try again later' })
        }

        return res.status(200).json('Success')
    })
})

app.get('/fetch-messages/:roomID', (req, res) => {
    const roomID = req.params.roomID
    const query = 'SELECT * FROM messages WHERE roomID = ? ORDER BY timeSent ASC;'

    conn.query(query, roomID, (err, info) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        }
        const messages = info
        res.json({ messages })
    })
})

app.get('/fetch-recent-chats/:email', (req, res) => {
    const email = req.params.email
    const query = `
        SELECT 
            sender,
            sendername,
            receiver,
            receivername,
            message, 
            timeSent
        FROM messages
        INNER JOIN (
            SELECT 
                GREATEST(sender, receiver) AS user_pair_max,
                LEAST(sender, receiver) AS user_pair_min,
                MAX(timeSent) AS max_timesent
            FROM messages
            WHERE sender = ? OR receiver = ?
            GROUP BY user_pair_max, user_pair_min
        ) latest_chats ON (
            (sender = latest_chats.user_pair_max 
             AND receiver = latest_chats.user_pair_min)
            OR
            (sender = latest_chats.user_pair_min 
             AND receiver = latest_chats.user_pair_max)
        ) AND timeSent = latest_chats.max_timesent
        ORDER BY timeSent DESC;
    `
    conn.query(query, [email, email], (err, result) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        } else if (result.length === 0) {
            return res.json('Empty')
        }

        const chats = result

        res.status(200).json({ chats })
    })
})

app.get('/fetch-books', (req, res) => {
    const query = 'SELECT * FROM materials;'
    conn.query(query, (err, info) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        }
        const books = info
        res.status(200).json({ books })
    })
})

app.get('/fetch-books-ed', (req, res) => {
    const query = `SELECT * FROM materials WHERE type = 'edModule';`
    conn.query(query, (err, info) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        }
        const books = info
        res.status(200).json({ books })
    })
})

app.get('/fetch-books-first', (req, res) => {
    const query = `SELECT * FROM materials WHERE type = 'firstaid';`
    conn.query(query, (err, info) => {
        if (err) {
            console.log('error executing query', err)
            return res.json({ error: queryError })
        }
        const books = info
        res.status(200).json({ books })
    })
})

// handle profilePicture upload
// app.post('/uploadPP', upload.single('image'), (req, res) => {
//     res.status(200).send('File uploaded!');
// });

// -----------------------------------------------------------------

app.use((err, req, res, next) => {
    // if (err instanceof multer.MulterError) {
    //     console.error('Multer Error', err.message)
    //     res.status(400).send('Multer Error:' + err.message)
    // }
    console.log(err.stack)
    res.status(500).json('Something Broke!')
})

const port = process.env.PORT

// listen
httpsServer.listen(port, '0.0.0.0', () => {
    console.log(`Listening on ${port}`)
})
