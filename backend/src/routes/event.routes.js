import { Router } from "express";
import { authenticate } from "../app.js";
import {
    listEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
} from '../controllers/event.controller.js';

const router = Router();

// All routes here require authentication


router.get('/', listEvents);
router.get('/:id', getEventById);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);
router.patch('/:id/status', authenticate, updateEventStatus);

export default router;
