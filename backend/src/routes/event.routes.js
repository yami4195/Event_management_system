import { Router } from "express";
import { authenticate } from "../app.js";
import upload from "../middlewares/upload.js";
import {
    listEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
} from '../controllers/event.controller.js';
import { getEventFeedback } from '../controllers/feedback.controller.js';
import { getEventRegistrations } from '../controllers/registration.controller.js';
import {
    getEventImages,
    getEventImageById,
    addEventImage,
    updateEventImage,
    deleteEventImage,
} from '../controllers/eventImage.controller.js';

const router = Router();

// Public routes
router.get('/', listEvents);
router.get('/:id/feedback', getEventFeedback);
router.get('/:id/images', getEventImages);
router.get('/:id/images/:imageId', getEventImageById);
router.get('/:id', getEventById);

// Authenticated routes
router.get('/:id/registrations', authenticate, getEventRegistrations);
router.post('/', authenticate, upload.single('image'), createEvent);
router.post('/:id/images', authenticate, upload.single('image'), addEventImage);
router.put('/:id', authenticate, upload.single('image'), updateEvent);
router.put('/:id/images/:imageId', authenticate, upload.single('image'), updateEventImage);
router.delete('/:id', authenticate, deleteEvent);
router.delete('/:id/images/:imageId', authenticate, deleteEventImage);
router.patch('/:id/status', authenticate, updateEventStatus);

export default router;
