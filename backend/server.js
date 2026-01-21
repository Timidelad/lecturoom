import express from 'express'
import cors from 'cors'
import connectToDatabase from './src/config/database.js';
import waitlistRoute from './src/routes/waitlist.js';
import authenticationRoute from './src/routes/authentication.js'
import superAdminRoute from './src/routes/superAdmin.route.js';
const app = express();
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
// app.use(cors({ origin: "https://lecturoom.vercel.app", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase()

// routes
app.use('/waitlist', waitlistRoute);
app.use('/authentication', authenticationRoute)
app.use('/superAdmin', superAdminRoute);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})