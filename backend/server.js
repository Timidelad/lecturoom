require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authentication');
const mongoose = require('mongoose');
const verifyRoutes = require('./routes/verifyEmail');
const facultyRoutes = require('./routes/faculty');
const memberRoutes = require('./routes/members');
const uploadRoutes = require('./routes/upload');
const bookingRoutes = require('./routes/booking');
const { Server } = require('socket.io');

const app = express();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors({ origin: "https://lecturoom.vercel.app", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());


//mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log('Connected to MongoDB Atlas')  })
    .catch((err) => { console.error('MongoDB connection error:', err)  })

// app.use('/api/authentication', authRoutes);
// app.use('/api', verifyRoutes)
// app.use('/api', facultyRoutes)
// app.use('/api/members', memberRoutes)
// app.use('/api/upload', uploadRoutes)
// app.use('/api/booking', bookingRoutes)

const http = require('http');
const server = http.createServer(app);

// const io = new Server(server, {
//     cors: { origin: "http://localhost:3000", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }
// });

const io = new Server(server, {
    cors: { origin: "https://lecturoom.vercel.app", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }
});
// app.locals.io = io;

io.on('connection', (socket) => {
    // console.log(`user connected: ${socket.id}`)

    socket.on('joinFaculty', (facultyId) => {
        socket.join(facultyId);
        // console.log(`joined faculty room :${facultyId}`)
    })

    socket.on('disconnect', () => {
        // console.log(`user disconnected : ${socket.id}`)
    })
})

app.use('/api/authentication', authRoutes);
app.use('/api', verifyRoutes)
app.use('/api', facultyRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/upload', uploadRoutes(io))
app.use('/api/booking', bookingRoutes(io))

// module.exports.io = io;

server.listen(5000, () => {
    // console.log('Server running on port 5000')
})

// console.log("JWT_SECRET:", process.env.JWT_SECRET)
// console.log("MONGODB_URI:", process.env.MONGODB_URI)
