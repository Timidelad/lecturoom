const express = require('express');
// const router = express.Router();
const { Faculty, Member, Booking, LectureRoom } = require('../models/faculty');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const { io } = require('../server');

function bookingRoutes(io) {
    const router = express.Router();
    function timeStringToMinutes(timeString) {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * 60 + minutes;
    }

    function verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) return res.status(401).json({ message: "No token provided" })

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            next()
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' })
        }
    }

    router.post('/check-availability', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const { lectureRoomId, date, startTime, endTime } = req.body;

        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "room availability cannot be checked"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "room availability cannot be checked"
                })
            }

            try {
                const faculty = await Faculty.findOne({ members: user.id });
                const start = timeStringToMinutes(startTime);
                const end = timeStringToMinutes(endTime);
                const facultyStart = timeStringToMinutes(faculty.bookingStartTime);
                const facultyEnd = timeStringToMinutes(faculty.bookingEndTime);
                const now = new Date();
                const bookingDateTime = new Date(`${date}T${startTime}`);

                if (start < facultyStart || end > facultyEnd) {
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    });
                }
                if (start < facultyStart || end < facultyStart) {
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (start > facultyEnd || end > facultyEnd) {
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (end <= start) {
                    return res.status(200).json({
                        available: false,
                        message: `Your end time cannot be less than start time`
                    })
                }

                if (bookingDateTime < now) {
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }

                const bookings = await Booking.find({
                    lectureRoom: lectureRoomId,
                    date,
                    status: "confirmed"
                });

                if (bookings.length == 0) {
                    return res.status(200).json({
                        available: true,
                        message: `Lecture room is available`
                    })
                }


                const conflictBooking = bookings.some((booking) => {
                    const bookingStart = timeStringToMinutes(booking.startTime);
                    const bookingEnd = timeStringToMinutes(booking.endTime);
                    return start < bookingEnd && end > bookingStart;
                });

                if (conflictBooking) {
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }
                return res.status(200).json({
                    available: true,
                    message: "Lecture room is available"
                })
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        })
    })

    router.get('/get-all-bookings', verifyToken, async (req, res) => {
        const { facultyId } = req.body;
        try {
            const faculty = await Faculty.findById(facultyId).select("lectureRooms")

            const bookings = await Booking.find({
                lectureRoom: { $in: faculty.lectureRooms }
            }).populate("user", "fullname email")
                .populate("lectureRoom", "roomName");

            // const allBookings = [];

            // faculty.lectureRooms.forEach(room => {
            //     room.bookings.forEach(booking => {
            //         allBookings.push({
            //             ...booking.toObject(),
            //             lectureRoomName: room.roomName,
            //         });
            //     });
            // });

            if (bookings.length === 0) {
                return res.json({ message: 'No bookings yet', bookings: [] })
            }
            res.json({ bookings: bookings })
        } catch (error) {
            console.error("error fetched", error)
            res.status(500).json({ error: error.message })
        }
    })

    // router.post('/book', verifyToken, async (req, res) => {
    //     const { lectureRoomId, date, startTime, endTime, purpose } = req.body;
    //     const session = await mongoose.startSession();
    //     session.startTransaction()

    //     try {
    //         if (!date || !startTime || !endTime || !purpose) {
    //             await session.abortTransaction()
    //             session.endSession()
    //             return res.status(404).json({ message: 'Input cannot be empty' })
    //         }

    //         const faculty = await Faculty.findOne({ 'members._id': req.userId });

    //         if (!faculty) {
    //             await session.abortTransaction()
    //             session.endSession()
    //             return res.status(404).json({ message: 'Faculty not found' })
    //         }
    //         const start = timeStringToMinutes(startTime);
    //         const end = timeStringToMinutes(endTime);

    //         const lectureRoom = await faculty.lectureRooms.id(lectureRoomId);

    //         const bookings = lectureRoom.bookings.filter(
    //             booking => booking.date === date
    //         );

    //         const conflictBooking = bookings.some((booking) => {
    //             const bookingStart = timeStringToMinutes(booking.startTime);
    //             const bookingEnd = timeStringToMinutes(booking.endTime);
    //             return start < bookingEnd && end > bookingStart;
    //         });

    //         if (conflictBooking) {
    //             await session.abortTransaction()
    //             session.endSession()
    //             return res.status(200).json({
    //                 available: false,
    //                 message: 'Lecture room is no more available'
    //             })
    //         }

    //         const newBooking = {
    //             lectureRoom: lectureRoomId,
    //             user: req.userId,
    //             date: date,
    //             startTime: startTime,
    //             endTime: endTime,
    //             purpose: purpose,
    //             status: "confirmed"
    //         }
    //         lectureRoom.bookings.push(newBooking)
    //         await faculty.save({ session })
    //         await session.commitTransaction()
    //         session.endSession()

    //         return res.status(201).json({ available: true, message: "booking successful" })
    //     } catch (error) {
    //         await session.abortTransaction()
    //         session.endSession()
    //         console.error("booking error: ", error)
    //         return res.status(500).json({ error: error.message })
    //     }
    // })

    router.post('/book-lecture-room', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const { lectureRoomId, date, startTime, endTime, purpose } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction()

        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "room cannot be booked"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "room availability cannot be checked"
                })
            }

            try {
                if (!date || !startTime || !endTime || !purpose) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: 'Input cannot be empty'
                    })
                }

                const faculty = await Faculty.findOne({ members: user.id });
                const facultyId = faculty._id;
                const start = timeStringToMinutes(startTime);
                const end = timeStringToMinutes(endTime);
                const facultyStart = timeStringToMinutes(faculty.bookingStartTime);
                const facultyEnd = timeStringToMinutes(faculty.bookingEndTime);
                const now = new Date();
                const bookingDateTime = new Date(`${date}T${startTime}`);

                if (start < facultyStart || end > facultyEnd) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    });
                }

                if (start < facultyStart || end < facultyStart) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (start > facultyEnd || end > facultyEnd) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (end <= start) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your end time cannot be less than start time`
                    })
                }

                if (bookingDateTime < now) {
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }

                const bookings = await Booking.find({
                    lectureRoom: lectureRoomId,
                    date,
                    status: "confirmed"
                });

                const conflictBooking = bookings.some((booking) => {
                    const bookingStart = timeStringToMinutes(booking.startTime);
                    const bookingEnd = timeStringToMinutes(booking.endTime);
                    return start < bookingEnd && end > bookingStart;
                });

                if (conflictBooking) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }

                const lectureRoom = await LectureRoom.findById(lectureRoomId);

                if (!lectureRoom) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(400).json({
                        success: false,
                        message: "Lecture room cannot be booked"
                    })
                }

                const newBooking = await Booking.create([{
                    lectureRoom: lectureRoomId,
                    user: user.id,
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    purpose: purpose,
                    status: "confirmed"
                }], { session });

                lectureRoom.bookings.push(newBooking[0]._id);
                // lectureRoom.bookings.push(newBooking._id);
                await lectureRoom.save({ session });
                await session.commitTransaction()
                session.endSession()

                const populatedBooking = await Booking.findById(newBooking[0]._id)
                    .populate({
                        path: "user",
                        select: "fullname email matricNumber level" // only send these fields
                    }).populate("lectureRoom")
                // console.log(populatedBooking)
                io.to(user.facultyId.toString()).emit("booking:update", {
                    lectureRoomId: lectureRoomId,
                    booking: populatedBooking,
                    action: "add"
                })

                return res.status(200).json({
                    available: true,
                    message: "lecture room booked successfully"
                })
            } catch (error) {
                console.error('error', error)
                await session.abortTransaction().catch(() => { })
                session.endSession()
                res.status(500).json({ error: error.message });
            }
        })
    })

    router.post('/cancel-booking', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const { bookingId, lectureRoomId } = req.body;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "booking cannot be cancelled"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "booking cannot be cancelled"
                })
            }

            try {
                const booking = await Booking.findById(bookingId);
                if (!booking) {
                    return res.status(400).json({
                        success: false,
                        message: "booking cannot be cancelled"
                    })
                }
                booking.status = "cancelled";
                await booking.save();

                const populatedCancel = await Booking.findById(bookingId)
                    .populate({
                        path: "user",
                        select: "fullname email matricNumber level"
                    })
                    .populate("lectureRoom")
                    .lean();

                populatedCancel._id = populatedCancel._id.toString();
                populatedCancel.lectureRoom._id = populatedCancel.lectureRoom._id.toString();
                populatedCancel.user._id = populatedCancel.user._id.toString();

                io.to(user.facultyId.toString()).emit("booking:update", {
                    lectureRoomId: lectureRoomId.toString(),
                    booking: populatedCancel,
                    action: "update"
                });
                res.status(200).json({
                    success: true,
                    message: 'Booking cancelled'
                })
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Something went wrong',
                    error: error.message
                })
            }
        })
    })

    router.post('/check-edit-availability', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const { bookingId, lectureRoomId, date, startTime, endTime } = req.body;

        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "room availability cannot be checked"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "room availability cannot be checked"
                })
            }

            try {
                const faculty = await Faculty.findOne({ members: user.id });
                const start = timeStringToMinutes(startTime);
                const end = timeStringToMinutes(endTime);
                const facultyStart = timeStringToMinutes(faculty.bookingStartTime);
                const facultyEnd = timeStringToMinutes(faculty.bookingEndTime);
                const now = new Date();
                const bookingDateTime = new Date(`${date}T${startTime}`);

                if (start < facultyStart || end > facultyEnd) {
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    });
                }

                if (start < facultyStart || end < facultyStart) {
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (start > facultyEnd || end > facultyEnd) {
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (end <= start) {
                    return res.status(200).json({
                        available: false,
                        message: `Your end time cannot be less than start time`
                    })
                }

                if (bookingDateTime < now) {
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }

                const allBookings = await Booking.find({
                    lectureRoom: lectureRoomId,
                    date,
                    status: "confirmed"
                });
                // console.log(allBookings)
                const bookings = allBookings.filter(
                    booking => booking._id.toString() !== bookingId.toString()
                );
                // console.log(bookings.length)

                if (bookings.length == 0) {
                    return res.status(200).json({
                        available: true,
                        message: `Lecture room is available`
                    })
                }

                const conflictBooking = bookings.some((booking) => {
                    const bookingStart = timeStringToMinutes(booking.startTime);
                    const bookingEnd = timeStringToMinutes(booking.endTime);
                    return start < bookingEnd && end > bookingStart;
                });

                if (conflictBooking) {
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }
                return res.status(200).json({
                    available: true,
                    message: "Lecture room is available"
                })
            } catch (error) {
                console.error(error)
                res.status(500).json({ error: error.message });
            }
        })
    })

    router.post('/edit-lecture-room', async (req, res) => {
        const authHeader = req.headers["authorization"];
        const { bookingId, lectureRoomId, date, startTime, endTime, purpose } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction()

        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "room cannot be booked"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "room availability cannot be checked"
                })
            }

            try {
                if (!date || !startTime || !endTime || !purpose) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: 'Input cannot be empty'
                    })
                }

                const faculty = await Faculty.findOne({ members: user.id });
                const facultyId = faculty._id;
                const start = timeStringToMinutes(startTime);
                const end = timeStringToMinutes(endTime);
                const facultyStart = timeStringToMinutes(faculty.bookingStartTime);
                const facultyEnd = timeStringToMinutes(faculty.bookingEndTime);
                const now = new Date();
                const bookingDateTime = new Date(`${date}T${startTime}`);

                if (start < facultyStart || end > facultyEnd) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    });
                }

                if (start < facultyStart || end < facultyStart) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (start > facultyEnd || end > facultyEnd) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your booking time must be between ${faculty.bookingStartTime} and ${faculty.bookingEndTime}`
                    })
                }

                if (end <= start) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: `Your end time cannot be less than start time`
                    })
                }

                if (bookingDateTime < now) {
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }

                const allBookings = await Booking.find({
                    lectureRoom: lectureRoomId,
                    date,
                    status: "confirmed"
                });

                const bookings = allBookings.filter(
                    booking => booking._id.toString() !== bookingId.toString()
                );

                const conflictBooking = bookings.some((booking) => {
                    const bookingStart = timeStringToMinutes(booking.startTime);
                    const bookingEnd = timeStringToMinutes(booking.endTime);
                    return start < bookingEnd && end > bookingStart;
                });

                if (conflictBooking) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(200).json({
                        available: false,
                        message: 'Lecture room is not available'
                    })
                }

                const theBooking = await Booking.findById(bookingId);

                if (!theBooking) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(400).json({
                        success: false,
                        message: "Booking cannot be edited"
                    })
                }

                theBooking.startTime = startTime;
                theBooking.endTime = endTime;
                theBooking.date = date;
                theBooking.purpose = purpose;
                await theBooking.save({ session })
                await session.commitTransaction()
                session.endSession()

                const populatedEdit = await Booking.findById(bookingId)
                    .populate({
                        path: "user",
                        select: "fullname email matricNumber level"
                    })
                    .populate("lectureRoom")
                    .lean(); // converts Mongoose doc → plain object

                // Normalize all ObjectIds to strings
                populatedEdit._id = populatedEdit._id.toString();
                populatedEdit.lectureRoom._id = populatedEdit.lectureRoom._id.toString();
                populatedEdit.user._id = populatedEdit.user._id.toString();

                io.to(user.facultyId.toString()).emit("booking:update", {
                    lectureRoomId: lectureRoomId.toString(),
                    booking: populatedEdit,
                    action: "update"
                });
                return res.status(200).json({
                    available: true,
                    message: "booking edited successfully"
                })
            } catch (error) {
                await session.abortTransaction().catch(() => { })
                session.endSession()
                res.status(500).json({ error: error.message });
            }
        })
    })

    return router
}

module.exports = bookingRoutes;