import { Router } from "express";
import {
    saveEvent,
    getEvents,
    getEventById,
    getEventsByEscenario,
    updateEvent,
    deleteEvent
} from "./event.controller.js";
import { uploadFieldImage } from "../../middlewares/file-uploader.js";
import { createEventValidator, updateEventValidator } from "../../middlewares/event-validators.js";

const router = Router();

router.post(
    "/",
    uploadFieldImage.single("imagen"),
    createEventValidator,
    saveEvent
);

router.get(
    "/",
    getEvents
);

router.get(
    "/:id",
    getEventById
);

router.get(
    "/escenario/:idEscenario",
    getEventsByEscenario
);

router.put(
    "/:id",
    uploadFieldImage.single("imagen"),
    updateEventValidator,
    updateEvent
);

router.delete(
    "/:id",
    deleteEvent
);

export default router;
