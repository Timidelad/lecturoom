import express from 'express'
import cors from 'cors'
import connectToDatabase from './src/config/database.js';
import waitlistRoute from './src/routes/waitlist.js';

const app = express();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors({ origin: "https://lecturoom.vercel.app", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase()

// routes
app.use('/waitlist', waitlistRoute);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})