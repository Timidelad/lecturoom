const express = require('express');
// const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const storage = multer.memoryStorage();
const sharp = require('sharp');
const upload = multer({ storage: multer.memoryStorage() });
const { Faculty, Member, Booking, LectureRoom } = require('../models/faculty');
const jwt = require('jsonwebtoken');

function uploadRoutes(io) {
    const router = express.Router();
    router.post('/getFromCloudinary', upload.single("image"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Compress and resize image using sharp
            const compressedBuffer = await sharp(req.file.buffer)
                .resize({ width: 800 }) // adjust width as needed
                .jpeg({ quality: 70 })  // adjust quality (0-100) as needed
                .toBuffer();

            // Convert buffer to base64
            const base64Image = compressedBuffer.toString('base64');
            const dataUri = `data:image/jpeg;base64,${base64Image}`;

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(dataUri, {
                folder: 'lecture-rooms'
            });

            res.status(200).json({ url: result.secure_url });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    })

    function verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) return res.status(401).json({ message: 'No token provided' })

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' })
        }
    }

    router.post('/upload-lecture-room', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const {
            roomName,
            capacity,
            facilities,
            imageUrl,
        } = req.body;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "unable to upload lecture room"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "unable to upload lecture room"
                })
            }

            try {
                const newLectureRoom = await LectureRoom.create({
                    roomName,
                    capacity,
                    facilities,
                    imageUrl,
                })
                await newLectureRoom.save();

                const faculty = await Faculty.findOne({ members: user.id });
                faculty.lectureRooms.push(newLectureRoom._id);
                await faculty.save();

                const newRoom = await LectureRoom.findById(newLectureRoom._id)
                    .populate({
                        path: "bookings",
                        populate: [
                            {
                                path: "user",
                                select: "fullname email matricNumber level"
                            },
                            {
                                path: "lectureRoom",
                                select: "roomName capacity facilities imageUrl"
                            }
                        ]
                    })
                // console.log(newRoom)
                io.to(user.facultyId.toString()).emit("upload:lectureRoom", newRoom)


                return res.status(200).json({
                    success: true,
                    message: 'Lecture room uploaded successfully!'
                })
            } catch (error) {
                console.error(error)
                return res.status(500).json({
                    success: false,
                    message: "Error during upload",
                    error: error.message
                })
            }
        })
    })

    router.post('/set-hours', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const { startTime, endTime } = req.body;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "unable to set time"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "unable to set time"
                })
            }

            try {
                const faculty = await Faculty.findOne({ members: user.id });
                faculty.bookingStartTime = startTime;
                faculty.bookingEndTime = endTime;
                await faculty.save();
                return res.status(200).json({
                    success: true,
                    message: "Booking time added successfully"
                })
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Error while adding booking time",
                    error: error.message
                })
            }
        })
    })

    router.post('/delete-lecture-room', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const { lectureRoomId } = req.body;
        // console.log(lectureRoomId)
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "unable to delete lecture room"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "unable to delete lecture room"
                })
            }

            try {
                const deletedRoom = await LectureRoom.findByIdAndDelete(lectureRoomId);

                if (!deletedRoom) {
                    return res.status(401).json({
                        success: false,
                        message: "Lecture room not found."
                    })
                }

                // Step 2: Remove references from faculties
                await Faculty.updateMany(
                    { lectureRooms: lectureRoomId },
                    { $pull: { lectureRooms: lectureRoomId } }
                );

                // Step 3: Delete bookings related to this lecture room
                await Booking.deleteMany({ lectureRoom: lectureRoomId });
                console.log(lectureRoomId)
                io.to(user.facultyId.toString()).emit("delete:lectureRoom", lectureRoomId)

                return res.status(200).json({
                    success: true,
                    message: "Lecture room deleted"
                })
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong.",
                    error: error.message
                })
            }
        })
    })

    return router;
}

module.exports = uploadRoutes;